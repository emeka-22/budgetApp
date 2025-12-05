# Security Documentation

## Overview

This document outlines the security measures implemented in the Budget App to protect against common vulnerabilities and attacks.

## Security Measures Implemented

### 1. Authentication & Authorization ✅

- **JWT-based authentication** with secure token signing
- **Password hashing** using bcryptjs with salt rounds
- **Authorization middleware** verifies user ownership of resources
- **Token expiration** with automatic logout on client side
- **Password strength requirements**: minimum 8 characters, must include uppercase, lowercase, number, and special character

### 2. Input Validation & Sanitization ✅

- **express-validator** for comprehensive input validation
- **Validation middleware** on all routes:
  - Auth routes: email format, password strength
  - Transaction routes: amount, type, category validation
  - Budget routes: name, amount, date range validation
- **Data sanitization** with escape() to prevent XSS
- **NoSQL injection protection** using express-mongo-sanitize

### 3. Rate Limiting ✅

- **General API rate limit**: 100 requests per 15 minutes per IP
- **Auth endpoint rate limit**: 5 requests per 15 minutes per IP
- **Prevents brute force attacks** on login/register endpoints

### 4. Security Headers ✅

Using **helmet** middleware to set secure HTTP headers:
- X-DNS-Prefetch-Control
- X-Frame-Options (prevents clickjacking)
- X-Content-Type-Options (prevents MIME sniffing)
- X-XSS-Protection
- Strict-Transport-Security (HSTS)
- Content-Security-Policy

### 5. CORS Configuration ✅

- **Restricted origins**: Only allows requests from configured CLIENT_URL
- **Credentials enabled**: Supports cookie-based authentication
- **Production-ready**: Uses environment variables for configuration

### 6. Request Size Limits ✅

- **Body size limit**: 10kb to prevent DoS attacks
- **JSON parser limits** configured
- **URL-encoded data limits** configured

### 7. HTTP Parameter Pollution Protection ✅

- **hpp middleware** prevents parameter pollution attacks
- Protects against duplicate parameters in query strings

### 8. Error Handling ✅

- **Production mode**: Generic error messages, no stack traces
- **Development mode**: Detailed errors for debugging
- **Structured logging**: Timestamp, path, method logged
- **No sensitive data exposure** in error responses

### 9. Logging & Monitoring ✅

- **Morgan middleware** for HTTP request logging
- **Development mode**: Detailed logs with morgan('dev')
- **Production mode**: Combined logs with morgan('combined')
- **Error logging** with structured format

### 10. Environment Variables ✅

- **.env file** excluded from version control
- **.env.example** template provided
- **Sensitive data** (JWT_SECRET, MONGO_URI) stored securely
- **Environment-specific** configuration support

### 11. Client-Side Security ✅

- **Token expiration checking**: Automatic logout when token expires
- **Auto-refresh check**: Validates token every minute
- **XSS prevention**: Input sanitization on server side
- **Secure token storage**: localStorage with expiration validation

## Environment Variables

Required environment variables (see `.env.example`):

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Security Best Practices

### For Development

1. **Never commit `.env`** file to version control
2. **Use strong JWT_SECRET**: Generate with `openssl rand -base64 64`
3. **Test with development mode** for detailed error messages
4. **Monitor logs** regularly for suspicious activity

### For Production

1. **Set NODE_ENV=production** in environment
2. **Use HTTPS** for all communications
3. **Rotate JWT_SECRET** regularly
4. **Use strong MongoDB credentials**
5. **Enable MongoDB authentication**
6. **Set up monitoring** and alerting
7. **Regular security audits**: Run `npm audit` frequently
8. **Keep dependencies updated**: Run `npm update` regularly
9. **Use environment-specific** CLIENT_URL
10. **Implement backup** and disaster recovery

## Remaining Security Considerations

While comprehensive security measures have been implemented, consider these additional enhancements for production:

### High Priority

- [ ] **CSRF Protection**: Add CSRF tokens for state-changing operations
- [ ] **Client-side input validation**: Add validation to all forms
- [ ] **Content Security Policy**: Fine-tune CSP headers
- [ ] **API versioning**: Implement versioning for backward compatibility

### Medium Priority

- [ ] **Session management**: Consider Redis for session storage
- [ ] **2FA/MFA**: Add two-factor authentication
- [ ] **Account lockout**: Lock accounts after failed login attempts
- [ ] **Password reset**: Implement secure password reset flow
- [ ] **Email verification**: Verify user emails on registration
- [ ] **Audit logging**: Log all sensitive operations

### Low Priority

- [ ] **IP whitelisting**: For admin endpoints
- [ ] **Geo-blocking**: Block requests from suspicious regions
- [ ] **Web Application Firewall**: Consider using WAF
- [ ] **DDoS protection**: Use services like Cloudflare

## Security Testing

### Automated Testing

```bash
# Check for vulnerable dependencies
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Check for outdated packages
npm outdated
```

### Manual Testing

1. **Test rate limiting**: Make multiple rapid requests
2. **Test authorization**: Try accessing other users' resources
3. **Test input validation**: Submit invalid data
4. **Test XSS**: Try injecting scripts in inputs
5. **Test NoSQL injection**: Try MongoDB operators in inputs

## Incident Response

If a security incident occurs:

1. **Isolate**: Disconnect affected systems
2. **Assess**: Determine scope and impact
3. **Contain**: Prevent further damage
4. **Eradicate**: Remove the threat
5. **Recover**: Restore normal operations
6. **Learn**: Document and improve

## Security Contacts

- **Security issues**: Report to project maintainer
- **Vulnerability disclosure**: Follow responsible disclosure
- **Emergency contact**: [Your contact information]

## Compliance

This application implements security measures aligned with:
- **OWASP Top 10** security risks
- **CWE/SANS Top 25** most dangerous software errors
- **GDPR** data protection principles (where applicable)

## Last Updated

Security documentation last updated: 2025-11-29

---

**Note**: Security is an ongoing process. Regularly review and update security measures as new threats emerge.
