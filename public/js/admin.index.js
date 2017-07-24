/**
 * Created by thuan on 18/07/2017.
 */
$('#password_modal, #confirm_password_modal').on('keyup', function ()
{
    if ($('#password_modal').val() == $('#confirm_password_modal').val()) {
        $('#warning-message').html('Matching').css('color', 'green');
    } else {
        $('#warning-message').html('Not Matching').css('color', 'red');
    }

    if (!$('#confirm_password_modal').val()) {
        $('#warning-message').html('');
    }
});

/**
 * valid data before submit
 */

$('#form_modal').submit(function (e)
{
    console.log("asds");
    if ($('#form-name').val() === '') {
        console.log("123");
        $('#message').html('Invalid name').css('color', 'red');
        e.preventDefault();
        return;
    }

    if ($('#form-email').val() === '') {
        $('#message').html('Invalid email').css('color', 'red');
        e.preventDefault();
        return;
    }

    if ($('#password_modal').val() === '') {
        $('#message').html('Invalid password').css('color', 'red');
        e.preventDefault();
        return;
    }

    if ($('#password_modal').val() !== $('#confirm_password_modal').val()) {
        $('#message').html('Confirm password does not match').css('color', 'red');
        e.preventDefault();
        return;
    }

    if (!$('#confirm_password_modal').val()) {
        $('#warning-message').html('');
    }

});


/**
 * open modal when edit
 */

$('.btn-edit').click(function () {
    resetForm();
    var from = $(this).data('from');
    console.log(from);
    $('#form_modal').attr('action', '/'+from +'/edit');
    $('.custom-modal-title').html('Edit');
    var id = $(this).attr('data-id');
    $('#form_id').val(id);
    var name = $(this).parent().parent().find('.td-name').html();
    var email = $(this).parent().parent().find('.td-email').find('a').html();
    var password = $(this).parent().parent().find('.td-password').html();
    $('#form-name').val(name.trim());
    $('#form-email').val(email.trim());
    $('#password_modal').val(password.trim());
    $('#confirm_password_modal').val(password.trim());
});


/**
 * add admin modal
 */
$('#btn-add-admin').click(function () {
    resetForm();
    var from = $(this).attr('data-from');
    console.log(from);
    $('#form_modal').attr('action', '/' + from + '/add');
    $('.custom-modal-title').html('Add admin account');
    $('#form-name').val('');
    $('#form-email').val('');
    $('#password_modal').val('');
    $('#confirm_password_modal').val('');
});

resetForm = function () {
    $('#warning-message').html('');
    $('#message').html('');
}

$('.btn-delete').click(function () {
    var from = $(this).attr('data-from');
    $('#delete_modal').attr('action', '/' + from + '/delete');
    $('.modal-delete').html("Delete row");
    var id = $(this).attr('data-id');
    console.log(id);
    $('#delete_id').val(id);
});
