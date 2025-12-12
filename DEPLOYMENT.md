# Deployment Guide

## Render Deployment

### Prerequisites
1. GitHub repository with the project code
2. Render account (free tier available)

### Steps

1. **Connect Repository to Render**
   - Log in to [Render](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository and branch (main)

2. **Configure Build Settings**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   JWT_SECRET=<generate-a-strong-secret-key>
   DB_PATH=./database.sqlite
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - Your API will be available at the provided URL

### Environment Variables for Production

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `JWT_SECRET` | `<strong-secret>` | JWT signing secret (generate a strong key) |
| `DB_PATH` | `./database.sqlite` | Database file path |

### Health Check
- Render will use the `/health` endpoint for health checks
- Ensure this endpoint returns a 200 status code

### Custom Domain (Optional)
- In Render dashboard, go to your service settings
- Add a custom domain if needed
- Update the Swagger server URL in `src/app.js` if using custom domain

## GitHub Actions CI/CD

The project includes automated CI/CD that:
- Runs tests on every push and pull request
- Performs security audits
- Automatically deploys to Render when pushing to main branch

### Workflow Triggers
- **Push to main**: Runs tests and deploys
- **Pull Request**: Runs tests only
- **Push to any branch**: Runs tests

## Local Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Setup
```bash
# Clone repository
git clone <your-repo-url>
cd api-security-project

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Update .env with your values
# Run setup script
node scripts/setup.js

# Start development server
npm run dev
```

### Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Production Considerations

### Security
- Use strong JWT secrets (32+ characters)
- Enable HTTPS in production
- Consider using environment-specific database
- Regular security audits

### Performance
- Monitor database performance
- Consider connection pooling for high traffic
- Implement rate limiting if needed

### Monitoring
- Set up logging and monitoring
- Monitor API health endpoints
- Track error rates and response times

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Verify build commands are correct

2. **Database Issues**
   - Ensure database path is writable
   - Check database file permissions
   - Verify Sequelize configuration

3. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Ensure proper CORS configuration

### Logs
- Check Render logs in the dashboard
- Use `console.log` for debugging (remove in production)
- Monitor application logs for errors

## Support

For deployment issues:
1. Check Render documentation
2. Review GitHub Actions logs
3. Verify environment variables
4. Test locally first
