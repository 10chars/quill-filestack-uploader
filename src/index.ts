import Quill from 'quill';

type Options = {
  filestack: any;
  filestackApiKey: string;
  fromSources?: Array<string>;
};

class FilestackUploader {
  quill: Quill;
  options: Options;
  range: any;
  filestack: any;
  client: any;
  picker: any;

  constructor(quill, options) {
    this.quill = quill;
    this.range = null;
    this.options = options;

    this.filestack = options.filestack || window['filestack'];
    this.client = this.filestack.init(this.options.filestackApiKey);

    this.picker = this.client.picker({
      fromSources: this.options.fromSources || ['local_file_system', 'googledrive', 'url', 'imagesearch'],
      maxFiles: 1,
      uploadInBackground: false,
      onUploadDone: res => {
        const file = res.filesUploaded[0];
        this.insertToEditor(file);
      },
    });

    if (typeof options.filestackApiKey === 'undefined') {
      console.warn('[Options Error] Filestack API key required');
    }

    if (typeof options.filestack === 'undefined' && typeof window['filestack'] === 'undefined') {
      console.warn('[Error] Filestack instance required');
    }

    const toolbar = this.quill.getModule('toolbar');
    toolbar.addHandler('image', this.selectImage);

    this.quill.root.addEventListener('drop', this.handleDrop, false);
    this.quill.root.addEventListener('paste', this.handlePaste, false);
  }

  selectImage = () => {
    this.range = this.quill.getSelection();
    this.picker.open();
  };

  handleDrop = event => {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
      if (document.caretRangeFromPoint) {
        const selection = document.getSelection();
        this.range = document.caretRangeFromPoint(event.clientX, event.clientY);

        if (selection && this.range) {
          selection.setBaseAndExtent(
            this.range.startContainer,
            this.range.startOffset,
            this.range.startContainer,
            this.range.startOffset
          );
        }
      }
      this.uploadToFilestack(event.dataTransfer.files[0])
        .then((result: { url: string }) => this.insertToEditor(result))
        .catch(err => console.error(err));
    }
  };

  handlePaste = event => {
    if (event.clipboardData && event.clipboardData.items && event.clipboardData.items.length) {
      this.uploadToFilestack(event.clipboardData.items[0])
        .then(result => {
          this.range = this.quill.getSelection();
          if (!this.range) {
            setTimeout(() => this.insertToEditor(result), 0);
          }
        })
        .catch(err => console.error(err));
    }
  };

  uploadToFilestack = (file: File): Promise<any> => {
    if (!file.type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp|vnd\.microsoft\.icon)/i)) return Promise.resolve();
    return this.client.upload(file);
  };

  insertToEditor = (file: { url: string }) => {
    const range = this.range;
    this.quill.insertEmbed(range.index, 'image', `${file.url}`);
    range.index++;
    this.quill.setSelection(range.index, 'api');
    this.picker.close();
  };
}

Quill.register('modules/filestackUploader', FilestackUploader);