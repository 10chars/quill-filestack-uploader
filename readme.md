# Quill Filestack Uploader

v1.0.0-alpha

```js
const quill = new Quill('#editor', {
  modules: {
    filestackUploader: {
      filestack: window['filestack'],
      filestackApiKey: '__FILESTACK_API_KEY__',
      fromSources: ['local_file_system', 'googledrive', 'url', 'imagesearch', ...]
    }
  }
});

```