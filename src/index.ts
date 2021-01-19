import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker } from '@jupyterlab/notebook';

import { CodeMirrorEditor } from '@jupyterlab/codemirror';

import '../style/index.css';


class JupyterLabSublime {
  private tracker: INotebookTracker;
  private app: JupyterFrontEnd;

  constructor(app: JupyterFrontEnd, tracker: INotebookTracker) {
    this.app = app;
    this.tracker = tracker;
    this.addCommands();
    this.onActiveCellChanged();
    this.tracker.activeCellChanged.connect(this.onActiveCellChanged, this);
  }

  private addCommands() {
    const { commands } = this.app;
    const self = this;
    function editorExec(id: string) {
      (self.tracker.activeCell.editor as CodeMirrorEditor).editor.execCommand(
        id
      );
    }
    // Manage Escape collision
    // TODO: Check if use has Escape set for command mode
    commands.addCommand('sublime:exit-editor', {
      execute: () => {
        editorExec('singleSelectionTop');
        commands.execute('notebook:enter-command-mode');
      },
      label: 'Exit Editor'
    });
    commands.addKeyBinding({
      command: 'sublime:exit-editor',
      keys: ['Escape'],
      selector: '.jp-Notebook.jp-mod-editMode' // not work... just disable the original in settings and work!
    });

    // Manage Shift-Tab collision
    commands.addCommand('sublime:indent-less-slash-tooltip', {
      execute: () => {
        if (
          !this.tracker.activeCell.editor.host.classList.contains(
            'jp-mod-completer-enabled'
          )
        ) {
          editorExec('indentLess');
        } else {
          commands.execute('tooltip:launch-notebook');
        }
      },
      label: 'Indent less or tooltip'
    });
    commands.addKeyBinding({
      command: 'sublime:indent-less-slash-tooltip',
      keys: ['Shift Tab'],
      selector: '.jp-Notebook.jp-mod-editMode'
    });

    // Manage Shift-Ctr-L collision
    commands.addCommand('sublime:split-selection-by-lLine', {
      execute: () => {
        editorExec('splitSelectionByLine');
      },
      label: 'Split selection by line'
    });
    commands.addKeyBinding({
      command: 'sublime:split-selection-by-lLine',
      keys: ['Ctrl Shift L'],
      selector: '.jp-Notebook.jp-mod-editMode'
    });


    // by me
    // 
    // 0 Manage Bracket no longer needed haha
    // 

    // 
    // 1 Manage Line
    // 
    commands.addCommand('sublime:deleteLine', {
      execute: () => {
        editorExec('deleteLine');
      },
      label: 'deleteLine',
    });
    commands.addKeyBinding({
      command: 'sublime:deleteLine',
      keys: ['Ctrl D'],
      selector: '.jp-Notebook.jp-mod-editMode',
    });

    // test insertLineAfter no longer needed haha

    commands.addCommand('sublime:swapLineUp', {
      execute: () => {
        editorExec('swapLineUp');
      },
      label: 'swapLineUp',
    });
    commands.addKeyBinding({
      command: 'sublime:swapLineUp',
      keys: ['Alt ArrowUp'],
      selector: '.jp-Notebook.jp-mod-editMode',
    });

    commands.addCommand('sublime:swapLineDown', {
      execute: () => {
        editorExec('swapLineDown');
      },
      label: 'swapLineDown',
    });
    commands.addKeyBinding({
      command: 'sublime:swapLineDown',
      keys: ['Alt ArrowDown'],
      selector: '.jp-Notebook.jp-mod-editMode',
    });

    commands.addCommand('sublime:duplicateLine', {
      execute: () => {
        editorExec('duplicateLine');
      },
      label: 'duplicateLine',
    });
    commands.addKeyBinding({
      command: 'sublime:duplicateLine',
      keys: ['Alt Shift ArrowDown'],
      selector: '.jp-Notebook.jp-mod-editMode',
    });
    
    // comments
    commands.addCommand('sublime:toggleCommentIndented', {
      execute: () => {
        editorExec('toggleCommentIndented');
      },
      label: 'toggleCommentIndented',
    });
    commands.addKeyBinding({
      command: 'sublime:toggleCommentIndented',
      keys: ['Ctrl /'],
      selector: '.jp-Notebook.jp-mod-editMode',
    });


    // 
    // 2 Manange Cursor
    // 
    commands.addCommand('sublime:selectNextOccurrence', {
      execute: () => {
        editorExec('selectNextOccurrence');
      },
      label: 'selectNextOccurrence',
    });
    commands.addKeyBinding({
      command: 'sublime:selectNextOccurrence',
      keys: ['Alt F'],
      selector: '.jp-Notebook.jp-mod-editMode',
    });

    commands.addCommand('sublime:skipAndSelectNextOccurrence', {
      execute: () => {
        editorExec('skipAndSelectNextOccurrence');
      },
      label: 'skipAndSelectNextOccurrence',
    });
    commands.addKeyBinding({
      command: 'sublime:skipAndSelectNextOccurrence',
      keys: ['Alt Shift F'],
      selector: '.jp-Notebook.jp-mod-editMode',
    });

    commands.addCommand('sublime:findUnderPrevious', {
      execute: () => {
        editorExec('findUnderPrevious');
      },
      label: 'findUnderPrevious',
    });
    commands.addKeyBinding({
      command: 'sublime:findUnderPrevious',
      keys: ['Alt Shift D'],
      selector: '.jp-Notebook.jp-mod-editMode',
    });

    commands.addCommand('sublime:findAllUnder', {
      execute: () => {
        editorExec('findAllUnder');
      },
      label: 'findAllUnder',
    });
    commands.addKeyBinding({
      command: 'sublime:findAllUnder',
      keys: ['Ctrl Alt A'],
      selector: '.jp-Notebook.jp-mod-editMode',
    });

    // select
    commands.addCommand('sublime:selectScope', {
        execute: () => {
          editorExec('selectScope');
        },
        label: 'selectScope',
    });
    commands.addKeyBinding({
        command: 'sublime:selectScope',
        keys: ['Ctrl I'],
        selector: '.jp-Notebook.jp-mod-editMode',
      });


    //
    // 3 Manage Deletion
    //
    commands.addCommand('sublime:delLineLeft', {
      execute: () => {
        editorExec('delLineLeft');
      },
      label: 'delLineLeft',
    });
    commands.addKeyBinding({
      command: 'sublime:delLineLeft',
      keys: ['Shift Backspace'],
      selector: '.jp-Notebook.jp-mod-editMode',
    });

    commands.addCommand('sublime:delLineRight', {
      execute: () => {
        editorExec('delLineRight');
      },
      label: 'delLineRight',
    });
    commands.addKeyBinding({
      command: 'sublime:delLineRight',
      keys: ['Shift Delete'],
      selector: '.jp-Notebook.jp-mod-editMode',
    });

    commands.addCommand('sublime:subword-backward-deletion', {
      execute: () => {
        const cEditor = (this.tracker.activeCell.editor as CodeMirrorEditor)
          .editor;
        const doc = cEditor.getDoc();
        const starts = doc.listSelections();
        // NOTE: This is non-trivial to deal with, results are often ugly, let's ignore this.
        if (starts.some(pos => pos.head.ch !== pos.anchor.ch)) {
          // tslint:disable-next-line:no-console
          console.log('Ignored attempt to delete subword!');
          return;
        }
        // CAV: To make sure when we undo this operation, we have carets showing in
        //      their rightful positions.
        cEditor.execCommand('goSubwordLeft');
        const ends = doc.listSelections();
        doc.setSelections(starts);
        if (starts.length !== ends.length) {
          // NOTE: Edge case where select are part of the same subword, need more thoughts on this.)
          // tslint:disable-next-line:no-console
          console.log(
            'Inogred attempt to delete subword, because some selection is part of the same subword'
          );
          return;
        }
        cEditor.operation(() => {
          for (let i = 0; i < starts.length; i++) {
            doc.replaceRange('', starts[i].head, ends[i].head, '+delete');
          }
        });
      },
      label: 'Subward backward deletion'
    });
    commands.addKeyBinding({
      command: 'sublime:subword-backward-deletion',
      keys: ['Alt Backspace'],
      selector: '.jp-Notebook.jp-mod-editMode'
    });

    commands.addCommand('sublime:subword-forward-deletion', {
      execute: () => {
        const cEditor = (this.tracker.activeCell.editor as CodeMirrorEditor)
          .editor;
        const doc = cEditor.getDoc();
        const starts = doc.listSelections();
        // NOTE: This is non-trivial to deal with, results are often ugly, let's ignore this.
        if (starts.some(pos => pos.head.ch !== pos.anchor.ch)) {
          // tslint:disable-next-line:no-console
          console.log('Ignored attempt to delete subword!');
          return;
        }
        // CAV: To make sure when we undo this operation, we have carets showing in
        //      their rightful positions.
        cEditor.execCommand('goSubwordRight');
        const ends = doc.listSelections();
        doc.setSelections(starts);
        if (starts.length !== ends.length) {
          // NOTE: Edge case where select are part of the same subword, need more thoughts on this.)
          // tslint:disable-next-line:no-console
          console.log(
            'Inogred attempt to delete subword, because some selection is part of the same subword'
          );
          return;
        }
        cEditor.operation(() => {
          for (let i = 0; i < starts.length; i++) {
            doc.replaceRange('', starts[i].head, ends[i].head, '+delete');
          }
        });
      },
      label: 'Subward forward deletion'
    });
    commands.addKeyBinding({
      command: 'sublime:subword-forward-deletion',
      keys: ['Alt Delete'],
      selector: '.jp-Notebook.jp-mod-editMode'
    });
  }

  private onActiveCellChanged(): void {
    const activeCell = this.tracker.activeCell;
    if (activeCell !== null) {
      (activeCell.editor as CodeMirrorEditor).setOption('keyMap', 'sublime');
    }
  }
}

/**
 * Initialization data for the jupyterlab_sublime extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  activate: (app: JupyterFrontEnd, tracker: INotebookTracker) => {
    // tslint:disable-next-line:no-unused-expression
    new JupyterLabSublime(app, tracker);
    // tslint:disable-next-line:no-console
    console.log('JupyterLab extension jupyterlab_sublime is activated!');
  },
  autoStart: true,
  id: 'jupyterlab_sublime',
  requires: [INotebookTracker]
};

export default extension;
