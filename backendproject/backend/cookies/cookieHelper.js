const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 30 * 24 * 60 * 60 * 1000
};

exports.setCookie = (res, name, value, options = {}) => {
  res.cookie(name, value, { ...cookieOptions, ...options });
};

exports.clearCookie = (res, name) => {
  res.clearCookie(name, { ...cookieOptions, maxAge: 0 });
};
