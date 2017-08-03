
export const isLoggedIn = (req,res,next) => {
	if(req.isAuthenticated()){
		return next();
	}
	req.session.oldUrl = req.url;
	res.redirect('/user/signin');
};

export const  notLoggedIn = (req,res,next) => {
	if(!req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
};

export const isAdmin = (req,res,next) => {
	if(req.user.type === 'admin'){
		return next();
	}
	res.redirect('/');
};


export const isSeller = (req,res,next) => {
	if(req.user.type === 'seller'){
		return next();
	}
	res.redirect('/');
};
