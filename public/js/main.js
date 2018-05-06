$(document).ready(function() {

    $('textarea#content').froalaEditor({
        // Set the image upload parameter.
        imageUploadParam: 'image',
        // Set the image upload URL.
        imageUploadURL: '/upload/image',
        // Additional upload params.
        imageUploadParams: {id: 'my_editor'},
        // Set request type.
        imageUploadMethod: 'POST',
        // Set max image size to 5MB.
        imageMaxSize: 5 * 1024 * 1024,
        // Allow to upload PNG and JPG.
        imageAllowedTypes: ['jpeg', 'jpg', 'png'],
        //====================================================
        // Set the file upload parameter.
        fileUploadParam: 'file',
        // Set the file upload URL.
        fileUploadURL: '/upload/file',
        // Additional upload params.
        fileUploadParams: {id: 'my_editor'},
        // Set request type.
        fileUploadMethod: 'POST',
        // Set max file size to 20MB.
        fileMaxSize: 20 * 1024 * 1024,
        // Allow to upload any file.
        fileAllowedTypes: ['*'],
        //===================================================
        // Set the video upload parameter.
        videoUploadParam: 'file',
        // Set the video upload URL.
        videoUploadURL: '/upload/file',
        // Additional upload params.
        videoUploadParams: {id: 'my_editor'},
        // Set request type.
        videoUploadMethod: 'POST',
        // Set max video size to 50MB.
        videoMaxSize: 50 * 1024 * 1024,
        // Allow to upload MP4, WEBM and OGG
        videoAllowedTypes: ['webm', 'jpg', 'ogg', 'mp4']
    });
});