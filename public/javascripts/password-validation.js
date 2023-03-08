//* PUT AFTER THE FORM!! *

//NICE BOOTSTRAP VERSION

$('#password, #confirm_password').on('keyup', function () {
    if ($('#password').val() != '' && $('#confirm_password').val() != '' && $('#password').val() == $(
        '#confirm_password').val()) {
      $("#submitBtn").attr("disabled", false);
      $('#cPwdValid').show();
      $('#cPwdInvalid').hide();
      $('#cPwdValid').html('Passwords match.').css('color', 'green');
      $('.pwds').removeClass('is-invalid')
      $('.pwds').addClass('is-valid')
    } else {
      $("#submitBtn").attr("disabled", true);
      $('#cPwdValid').hide();
      $('#cPwdInvalid').show();
      $('#cPwdInvalid').html('Passwords do not match').css('color', '#dc3545');
      $('.pwds').addClass('is-invalid')
    }
  });

  (function () {
  'use strict'
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.querySelectorAll('.needs-validation')
      var theform = document.getElementById('form1')
        
      // Loop over them and prevent submission
      Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
              if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
              }

              form.classList.add('was-validated')
            }, false);
          })
          theform.querySelectorAll('.ps').forEach(input => {
              input.addEventListener(('input'), () => {
                if (input.checkValidity()) {
                  input.classList.remove('is-invalid');
                  input.classList.add('is-valid');
                } else {
                  input.classList.remove('is-valid');
                  input.classList.add('is-invalid');
                }
                var is_valid = $('.ps').length === $('.ps.is-valid').length;
                $("#submitBtn").attr("disabled", !is_valid);

              });
            });
          })()
           


/// SIMPLE VERSION 

//            // const name = document.getElementsById('name')
//   const form = document.getElementById('form')
//   const errorElement = document.getElementById('error')
//   const password = document.getElementById('password')
//   const conpassword = document.getElementById('confirm_password')

//   form.addEventListener('submit', (e) => {
//     let messages = []
//     // if (name.value === '' || name.value == null) {
//     //   messages.push('Userame is required')
//     // }

//     if (password.value.length < 8) {
//       messages.push('Password must be atleast 8 characters')
//     }
//     var letters = /([A-z])/g;
//     if (!(password.value.match(letters))) {
//       messages.push('Password must have a letter')
//     }
//     var numbers = /([0-9])/g;
//     if (!(password.value.match(numbers))) {
//       messages.push('Password must have a number')
//     }

//     if (password.value != conpassword.value) {
//       messages.push('Passwords dont match')
//     }
//     if (messages.length > 0) {
//       e.preventDefault()
//       errorElement.innerText = messages.join(', ')
//     }
//   })