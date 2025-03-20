# Contributing to FableTongue

We love your input! We want to make contributing to FableTongue as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `master`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable
2. Update the TECHNICAL_DOCUMENTATION.md with any architectural changes
3. The PR will be merged once you have the sign-off of two other developers

## Any Contributions You Make Will Be Under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report Bugs Using GitHub's [Issue Tracker](https://github.com/russmaw/fabletongue/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/russmaw/fabletongue/issues/new); it's that easy!

## Write Bug Reports With Detail, Background, and Sample Code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Use a Consistent Coding Style

* 2 spaces for indentation rather than tabs
* You can try running `npm run lint` for style unification

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to making participation in our project and our community a harassment-free experience for everyone.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

## Development Setup

1. Install dependencies:
```bash
cd web
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Make your changes and test them locally

## Testing

Before submitting a pull request, make sure to:

1. Add tests for any new features
2. Run the test suite:
```bash
npm run test
```

3. Run the linter:
```bash
npm run lint
```

## Documentation

- Update component documentation if you change any interfaces
- Add JSDoc comments for new functions
- Update the technical documentation for architectural changes

## Branch Naming Convention

- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`
- Performance improvements: `perf/description`

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## License

By contributing, you agree that your contributions will be licensed under its MIT License. 