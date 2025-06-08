# Contributing to Attendance Tracker

Thank you for considering contributing to Attendance Tracker! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## How Can I Contribute?

### Reporting Bugs

Before submitting a bug report:

1. Check the issue tracker to see if the bug has already been reported.
2. If you're unable to find an open issue addressing the problem, open a new one.

When submitting a bug report, include:

- A clear and descriptive title
- Steps to reproduce the behavior
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment details (OS, browser, version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

1. Use a clear and descriptive title
2. Provide a detailed description of the suggested enhancement
3. Explain why this enhancement would be useful
4. Include any relevant examples or mockups

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and ensure they pass
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/attendance-tracker.git
   cd attendance-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and update the values as needed.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Coding Guidelines

### JavaScript/TypeScript

- Follow the ESLint configuration
- Use TypeScript for type safety
- Write meaningful variable and function names
- Add comments for complex logic

### React Components

- Use functional components with hooks
- Keep components focused on a single responsibility
- Use proper prop types
- Follow the project's component structure

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow the project's design system
- Ensure responsive design works on all screen sizes

## Testing

- Write tests for new features
- Ensure all tests pass before submitting a pull request
- Test on different browsers and devices if possible

## Documentation

- Update documentation for any changes to APIs or features
- Document new features thoroughly
- Keep the README up to date

## Commit Messages

- Use clear and meaningful commit messages
- Follow the conventional commits format:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `style:` for formatting changes
  - `refactor:` for code refactoring
  - `test:` for adding or modifying tests
  - `chore:` for maintenance tasks

## License

By contributing to Attendance Tracker, you agree that your contributions will be licensed under the project's MIT License.

