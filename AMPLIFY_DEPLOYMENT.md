# AWS Amplify Deployment Guide

This guide will help you deploy the Attendance Tracker application to AWS Amplify.

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS Amplify CLI installed (`npm install -g @aws-amplify/cli`)
3. AWS CLI configured with your credentials

## Deployment Steps

### 1. Configure AWS Amplify CLI

```bash
amplify configure
```

Follow the prompts to set up your AWS credentials.

### 2. Pull the Existing Amplify Project

```bash
amplify pull --appId dl0n1j2m34lvi --envName staging
```

This will:
- Download the existing Amplify configuration
- Set up the local environment
- Configure the backend resources

### 3. Install Dependencies

```bash
npm install
```

### 4. Build the Application

```bash
npm run build
```

### 5. Deploy to Amplify

```bash
amplify publish
```

This will:
- Build the application
- Deploy the frontend to Amplify hosting
- Update any backend resources

## Environment Variables

The application uses the following environment variables:

- `NODE_ENV`: Set to "production" for production builds
- `VITE_API_URL`: API endpoint URL (automatically configured by Amplify)

## Build Configuration

The `amplify.yml` file contains the build configuration for Amplify:

```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - npm install
        - npm run build
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Troubleshooting

### Build Failures

1. Check that all dependencies are properly installed
2. Verify that the build command works locally
3. Check the Amplify console for detailed error logs

### API Issues

1. Ensure CORS is properly configured
2. Check that API endpoints are accessible
3. Verify authentication settings

### Frontend Issues

1. Check that the build artifacts are in the correct directory (`dist`)
2. Verify that all static assets are properly referenced
3. Check browser console for JavaScript errors

## Manual Deployment Alternative

If you prefer to deploy manually:

1. Build the application: `npm run build`
2. Upload the `dist` folder contents to your preferred hosting service
3. Configure the API endpoints in your hosting environment

## Support

For issues with AWS Amplify deployment, refer to:
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Amplify CLI Documentation](https://docs.amplify.aws/cli/)

