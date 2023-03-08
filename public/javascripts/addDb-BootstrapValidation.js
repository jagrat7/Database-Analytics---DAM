var forms = document.querySelectorAll('.needs-validation')
var theform = document.getElementById('addDbform')

theform.querySelectorAll('.ps').forEach(input => {
    input.addEventListener(('input'), () => {
        if (input.checkValidity()) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        }

    });
});
