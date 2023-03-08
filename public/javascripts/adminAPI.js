
  const deleteUser = document.querySelectorAll('.delete-user');
  const approvedUser = document.querySelectorAll('.approve-user');
  const setAdminUser = document.querySelectorAll('.setAdmin');
  const setViewerUser = document.querySelectorAll('.setviewer');

  deleteUser.forEach(element => {
      element.addEventListener('click', (e) => {

      Swal.fire({
      title: 'Do you want to reject '+ element.dataset.email + '?',
      text: "User will be removed from the database",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#65d672',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/dashboard/adminPanel?id=${element.dataset.userid}`, { method: 'DELETE',})
        .then(response => response.json())
        .then(data => window.location.href = data.redirect)
        .catch(err => console.log(err));
      }})

    })
  });
  approvedUser.forEach(element => {
      element.addEventListener('click', (e) => {

      Swal.fire({
      title: 'Do you want to approve '+ element.dataset.email + '?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#65d672',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/dashboard/adminPanel?id=${element.dataset.userid}&type=approved&value=1`, { method: 'PATCH',})
        .then(response => response.json())
        .then(data => window.location.href = data.redirect)
        .catch(err => console.log(err));
      }})

    })
  });
  setAdminUser.forEach(element => {
      element.addEventListener('click', (e) => {

      Swal.fire({
      title: 'Do you want to set '+ element.dataset.email + ' as admin?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#65d672',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/dashboard/adminPanel?id=${element.dataset.userid}&type=role&value=admin`, { method: 'PATCH',})
        .then(response => response.json())
        .then(data => window.location.href = data.redirect)
        .catch(err => console.log(err));
      }})

    })
  });
  setViewerUser.forEach(element => {
      element.addEventListener('click', (e) => {

      Swal.fire({
      title: 'Do you want to set '+ element.dataset.email + ' as viewer only?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#65d672',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/dashboard/adminPanel?id=${element.dataset.userid}&type=role&value=viewer`, { method: 'PATCH',})
        .then(response => response.json())
        .then(data => window.location.href = data.redirect)
        .catch(err => console.log(err));
      }})

    })
  });


