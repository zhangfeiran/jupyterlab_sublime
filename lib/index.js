"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notebook_1 = require("@jupyterlab/notebook");
require("../style/index.css");
const IS_MAC = !!navigator.platform.match(/Mac/i);
class JupyterLabSublime {
    constructor(app, tracker) {
        this.app = app;
        this.tracker = tracker;
        this.addCommands();
        this.onAcitveCellChanged();
        this.tracker.activeCellChanged.connect(this.onAcitveCellChanged, this);
    }
    addCommands() {
        const { commands } = this.app;
        const self = this;
        function editorExec(id) {
            self.tracker.activeCell.editor.editor.execCommand(id);
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
            selector: '.CodeMirror-focused'
        });
        // Manage Shift-Tab collision
        commands.addCommand('sublime:indent-less-slash-tooltip', {
            execute: () => {
                if (!this.tracker.activeCell.editor.host.classList.contains('jp-mod-completer-enabled')) {
                    editorExec('indentLess');
                }
                else {
                    commands.execute('tooltip:launch-notebook');
                }
            },
            label: 'Indent less or tooltip'
        });
        commands.addKeyBinding({
            command: 'sublime:indent-less-slash-tooltip',
            keys: ['Shift Tab'],
            selector: '.CodeMirror-focused'
        });
        // Manage Shift-Ctr-L collision
        commands.addCommand('sublime:split-selection-by-lLine', {
            execute: () => {
                editorExec('splitSelectionByLine');
            },
            label: 'Split selection by line'
        });
        if (IS_MAC) {
            commands.addKeyBinding({
                command: 'sublime:split-selection-by-lLine',
                keys: ['Accel Shift L'],
                selector: '.CodeMirror-focused'
            });
        }
        else {
            commands.addKeyBinding({
                command: 'sublime:split-selection-by-lLine',
                keys: ['Ctrl Shift L'],
                selector: '.CodeMirror-focused'
            });
        }
        // 
        // 0 Manage Bracket 
        // 
        commands.addCommand('sublime:goToBracket', {
            execute: () => {
                editorExec('goToBracket');
            },
            label: 'goToBracket',
        });
        commands.addKeyBinding({
            command: 'sublime:goToBracket',
            keys: ['Ctrl M'],
            selector: '.CodeMirror-focused',
        });
        commands.addCommand('sublime:selectBetweenBrackets', {
            execute: () => {
                editorExec('selectBetweenBrackets');
            },
            label: 'selectBetweenBrackets',
        });
        commands.addKeyBinding({
            command: 'sublime:selectBetweenBrackets',
            keys: ['Ctrl Shift M'],
            selector: '.CodeMirror-focused',
        });
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
            selector: '.CodeMirror-focused',
        });
        commands.addCommand('sublime:insertLineAfter', {
            execute: () => {
                editorExec('insertLineAfter');
            },
            label: 'insertLineAfter',
        });
        commands.addKeyBinding({
            command: 'sublime:insertLineAfter',
            keys: ['Ctrl Enter'],
            selector: '.CodeMirror-focused',
        });
        commands.addCommand('sublime:swapLineUp', {
            execute: () => {
                editorExec('swapLineUp');
            },
            label: 'swapLineUp',
        });
        commands.addKeyBinding({
            command: 'sublime:swapLineUp',
            keys: ['Alt ArrowUp'],
            selector: '.CodeMirror-focused',
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
            selector: '.CodeMirror-focused',
        });
        commands.addCommand('sublime:duplicateLine', {
            execute: () => {
                editorExec('duplicateLine');
            },
            label: 'duplicateLine',
        });
        commands.addKeyBinding({
            command: 'sublime:duplicateLine',
            keys: ['Ctrl Shift D'],
            selector: '.CodeMirror-focused',
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
            selector: '.CodeMirror-focused',
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
            selector: '.CodeMirror-focused',
        });
        commands.addCommand('sublime:findUnder', {
            execute: () => {
                editorExec('findUnder');
            },
            label: 'findUnder',
        });
        commands.addKeyBinding({
            command: 'sublime:findUnder',
            keys: ['Alt Shift F'],
            selector: '.CodeMirror-focused',
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
            selector: '.CodeMirror-focused',
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
            selector: '.CodeMirror-focused',
        });
        // 4 Manage Deletion
        commands.addCommand('sublime:delLineLeft', {
            execute: () => {
                editorExec('delLineLeft');
            },
            label: 'delLineLeft',
        });
        commands.addKeyBinding({
            command: 'sublime:delLineLeft',
            keys: ['Shift Backspace'],
            selector: '.CodeMirror-focused',
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
            selector: '.CodeMirror-focused',
        });
        commands.addCommand('sublime:subword-backward-deletion', {
            execute: () => {
                const cEditor = this.tracker.activeCell.editor
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
                    console.log('Inogred attempt to delete subword, because some selection is part of the same subword');
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
            selector: '.CodeMirror-focused'
        });
        commands.addCommand('sublime:subword-forward-deletion', {
            execute: () => {
                const cEditor = this.tracker.activeCell.editor
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
                    console.log('Inogred attempt to delete subword, because some selection is part of the same subword');
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
            selector: '.CodeMirror-focused'
        });
    }
    onAcitveCellChanged() {
        const activeCell = this.tracker.activeCell;
        if (activeCell !== null) {
            activeCell.editor.setOption('keyMap', 'sublime');
        }
    }
}
/**
 * Initialization data for the jupyterlab_sublime extension.
 */
const extension = {
    activate: (app, tracker) => {
        // tslint:disable-next-line:no-unused-expression
        new JupyterLabSublime(app, tracker);
        // tslint:disable-next-line:no-console
        console.log('JupyterLab extension jupyterlab_sublime is activated!');
    },
    autoStart: true,
    id: 'jupyterlab_sublime',
    requires: [notebook_1.INotebookTracker]
};
exports.default = extension;
