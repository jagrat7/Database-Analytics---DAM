
function checkAdmin(req, res, next) {
    req.user.then(user => {
      const userRole = user.role
      if (userRole !== 'admin') {
        // console.log('you are not admin', userRole)
        return res.status(403).render('403')
  
      }
    //   console.log('you are admin', userRole)
  
      next()
    })
  
  }
  
  
  function checkApproved(req, res, next) {
    req.user.then((user) => {
      if (user.approved) {
  
        return next()
      }
  
      return res.redirect('/notApproved')
    })
  
  
  }

  module.exports ={checkAdmin,checkApproved}