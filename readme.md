# Quill Filestack Uploader

v1.0.0-alpha

```
const quill = new Quill('#editor', {
  modules: {
    toolbar: {
      container: toolbarOptions
    },
    filestackUploader: {
      filestack: window['filestack'],
      filestackApiKey: '__FILESTACK_API_KEY__'
    }
  }
});

```