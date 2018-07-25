import {
  JupyterLab, JupyterLabPlugin,
} from "@jupyterlab/application";

import {
  INotebookTracker,
} from "@jupyterlab/notebook";

import {
  CodeMirrorEditor,
} from "@jupyterlab/codemirror";

import "../style/index.css";

class JupyterLabSublime {

  private tracker: INotebookTracker;
  private app: JupyterLab;

  constructor(app: JupyterLab, tracker: INotebookTracker) {
    this.app = app;
    this.tracker = tracker;
    this.addCommands();
    this.onAcitveCellChanged();
    this.tracker.activeCellChanged.connect(this.onAcitveCellChanged, this);
  }

  private addCommands() {
    const { commands } = this.app;
    const self = this;
    function editorExec(id: string) {
      (self.tracker.activeCell.editor as CodeMirrorEditor).editor.execCommand(id);
    }
    // Manage Escape collision
    // TODO: Check if use has Escape set for command mode
    commands.addCommand("sublime:exit-editor", {
      execute: () => {
        editorExec("singleSelectionTop");
        commands.execute("notebook:enter-command-mode");
      },
      label: "Exit Editor",
    });
    commands.addKeyBinding({
      command: "sublime:exit-editor",
      keys: ["Escape"],
      selector: ".CodeMirror-focused",
    });

    // Manage Shift-Tab collision
    commands.addCommand("sublime:indent-less-slash-tooltip", {
      execute: () => {
        if (!this.tracker.activeCell.editor.host.classList.contains("jp-mod-completer-enabled")) {
          editorExec("indentLess");
        } else {
          commands.execute("tooltip:launch-notebook");
        }
      },
      label: "Indent less or tooltip",
    });
    commands.addKeyBinding({
      command: "sublime:indent-less-slash-tooltip",
      keys: ["Shift Tab"],
      selector: ".CodeMirror-focused",
    });

    // Manage Shift-Ctr-L collision
    commands.addCommand("sublime:split-selection-by-lLine", {
      execute: () => {
        editorExec("splitSelectionByLine");
      },
      label: "Split selection by line",
    });
    commands.addKeyBinding({
      command: "sublime:split-selection-by-lLine",
      keys: ["Ctrl Shift L"],
      selector: ".CodeMirror-focused",
    });

    // Manage Ctrl-M collision
    commands.addCommand("sublime:go-to-bracket", {
      execute: () => {
        editorExec("goToBracket");
      },
      label: "Go to bracket",
    });
    commands.addKeyBinding({
      command: "sublime:go-to-bracket",
      keys: ["Ctrl M"],
      selector: ".CodeMirror-focused",
    });

    // Manage Shift-Ctrl-D collision
    commands.addCommand("sublime:duplicate-line", {
      execute: () => {
        editorExec("duplicateLine");
      },
      label: "Duplicate line",
    });
    commands.addKeyBinding({
      command: "sublime:duplicate-line",
      keys: ["Ctrl Shift D"],
      selector: ".CodeMirror-focused",
    });

    // Repurpose Ctrl-Up
    commands.addCommand("sublime:add-cursor-to-prev-line", {
      execute: () => {
        editorExec("addCursorToPrevLine");
      },
      label: "Add cursor to previous line",
    });
    commands.addKeyBinding({
      command: "sublime:add-cursor-to-prev-line",
      keys: ["Ctrl ArrowUp"],
      selector: ".CodeMirror-focused",
    });

    // Repurpose Ctrl-Down
    commands.addCommand("sublime:add-cursor-to-next-line", {
      execute: () => {
        editorExec("addCursorToNextLine");
      },
      label: "Add cursor to next line",
    });
    commands.addKeyBinding({
      command: "sublime:add-cursor-to-next-line",
      keys: ["Ctrl ArrowDown"],
      selector: ".CodeMirror-focused",
    });

  }

  private onAcitveCellChanged(): void {
    const activeCell = this.tracker.activeCell;
    if (activeCell !== null) {
      (activeCell.editor as CodeMirrorEditor).setOption("keyMap", "sublime");
    }
  }
}

/**
 * Initialization data for the jupyterlab_sublime extension.
 */
const extension: JupyterLabPlugin<void> = {
  activate: (app: JupyterLab, tracker: INotebookTracker) => {
    // tslint:disable:no-unused-expression
    new JupyterLabSublime(app, tracker);
    // tslint:disable:no-console
    console.log("JupyterLab extension jupyterlab_sublime is activated!");
  },
  autoStart: true,
  id: "jupyterlab_sublime",
  requires: [INotebookTracker],
};

export default extension;