# Release Please - Functional Capabilities

## Overview

Release Please is an automated release management tool that streamlines the software release process by automating CHANGELOG generation, GitHub releases creation, and version bumps for projects following the Conventional Commits specification.

## Core Functional Capabilities

### 1. Automated Release Pull Request Management

- **Monitors Git History**: Continuously analyzes commits on the release branch (typically `main`)
- **Parses Conventional Commits**: Understands commit message structure following [conventionalcommits.org](https://www.conventionalcommits.org/) specification
- **Creates Release PRs**: Automatically opens and maintains release pull requests that propose version bumps
- **Updates Release PRs**: Keeps release PRs up-to-date as new commits are merged
- **Multi-component Support**: Can handle both single-component repositories and monorepos with multiple releasable components

### 2. Intelligent Version Management

- **Semantic Versioning**: Automatically determines version bumps following [SemVer](https://semver.org/) specification:
  - `fix:` commits → patch version bump (e.g., 1.0.0 → 1.0.1)
  - `feat:` commits → minor version bump (e.g., 1.0.0 → 1.1.0)
  - Breaking changes (e.g., `feat!:`, `fix!:`) → major version bump (e.g., 1.0.0 → 2.0.0)
- **Custom Versioning Strategies**: Supports multiple versioning strategies that can be configured independently
- **Manual Version Control**: Supports `Release-As` footer for manual version specification

### 3. CHANGELOG Generation

- **Automated Notes**: Generates structured CHANGELOG entries from commit history
- **Conventional Changelog Format**: Uses industry-standard changelog formatting
- **Customizable Notes**: Supports custom changelog note generators including GitHub's native changelog generator
- **Commit Override**: Allows amending release notes by editing merged PR descriptions

### 4. Multi-Language and Ecosystem Support

Supports 20+ different language ecosystems with automatic file updates:

| Language/Ecosystem | Key Files Updated |
|-------------------|-------------------|
| Node.js | `package.json`, `package-lock.json`, `CHANGELOG.md` |
| Python | `pyproject.toml`, `__init__.py`, `setup.py`, `CHANGELOG.md` |
| Java/Maven | `pom.xml`, `CHANGELOG.md` |
| Rust | `Cargo.toml`, `CHANGELOG.md` |
| Go | `CHANGELOG.md` (go.mod for version tags) |
| Ruby | `version.rb`, `CHANGELOG.md` |
| PHP | `composer.json`, `CHANGELOG.md` |
| Dart | `pubspec.yaml`, `CHANGELOG.md` |
| Elixir | `mix.exs`, `CHANGELOG.md` |
| Helm | `Chart.yaml`, `CHANGELOG.md` |
| Terraform | `README.md`, `CHANGELOG.md` |
| And more... | See [README](../README.md#strategy-language-types-supported) for full list |

### 5. GitHub Integration

- **GitHub API Integration**: Operates entirely through GitHub API (no local git CLI required)
- **Release Creation**: Automatically creates GitHub releases when release PRs are merged
- **Tag Management**: Creates and manages git tags tied to releases
- **Label Management**: Uses labels to track release lifecycle:
  - `autorelease: pending` - Release PR is open
  - `autorelease: tagged` - Release has been tagged
  - `autorelease: snapshot` - Snapshot version (Java-specific)
  - `autorelease: published` - Release has been published (convention)

### 6. Monorepo Support via Manifest Configuration

- **Manifest Files**: Uses JSON manifest files to track multiple components:
  - `.release-please-manifest.json` - Maps component paths to versions
  - `release-please-config.json` - Maps component paths to configurations
- **Independent Releases**: Can release components independently or together
- **Plugin System**: Extensible plugin architecture for custom monorepo behaviors
- **Path-based Component Detection**: Automatically associates commits with components based on file paths

### 7. Flexible Configuration

- **JSON Schema Validated**: Configuration follows well-defined JSON schemas
- **Customizable Options**:
  - Custom changelog notes
  - Custom updaters for non-standard file formats
  - Custom versioning strategies
  - Release branch selection
  - Label customization
  - Pull request title/body customization
  - Include/exclude paths
  - And more...

### 8. Deployment Options

- **GitHub Action** (Recommended): [googleapis/release-please-action](https://github.com/googleapis/release-please-action)
- **CLI Tool**: Can be run from command line via npm package
- **Library**: Can be integrated into custom Node.js applications
- **Automated Workflows**: Integrates with CI/CD pipelines

## Key Design Principles

### 1. No Database Required
- Uses GitHub as the source of truth
- All state is derived from git history, tags, releases, and PRs
- No external database or state management needed

### 2. API-First Architecture
- All operations through GitHub API
- No local git CLI dependencies
- Facilitates cloud-native deployments

### 3. Read-Through Caching
- Optimizes API usage through intelligent caching
- Reduces GitHub API quota consumption
- Improves performance for large repositories

### 4. Extensibility
- Plugin system for custom behaviors
- Factory pattern for component instantiation
- Strategy pattern for language-specific handling
- Interface-based design for custom implementations

## Use Cases

### Primary Use Cases

1. **Automated Release Management**: Replace manual release processes with automated PR-based releases
2. **Consistent Versioning**: Ensure SemVer compliance across all releases
3. **Changelog Automation**: Eliminate manual CHANGELOG maintenance
4. **Monorepo Management**: Handle complex monorepo release scenarios
5. **Team Collaboration**: Enable team review of pending releases before they go live

### Integration Scenarios

1. **GitHub Actions Workflow**: Trigger on push to main branch
2. **CI/CD Pipeline**: Integrate with existing build/test pipelines
3. **Release Automation**: Combine with package publishing workflows
4. **Backport Branches**: Manage releases on multiple long-term support branches

## Limitations

### What Release Please Does NOT Do

- **Package Publishing**: Does not publish to npm, PyPI, Maven Central, etc. (users must add separate publishing steps)
- **Complex Branch Management**: Not designed for GitFlow or complex branching strategies
- **Code Building**: Does not compile or build code
- **Testing**: Does not run tests
- **Deployment**: Does not deploy applications

## Performance Characteristics

### Designed For
- Repositories with standard commit history (hundreds to thousands of commits)
- Conventional commits-based workflows
- Regular release cadences

### Optimization Strategies
- File content caching to reduce API calls
- GraphQL API usage for efficient data fetching
- Configurable commit history limits
- Incremental PR updates vs. full rebuilds

### Known Limitations
- Large monorepos (50+ components) may experience slower processing
- Very long commit histories may hit API rate limits
- Heavy usage may require GitHub API rate limit management

## API Quotas and Rate Limits

Release Please makes numerous GitHub API calls. Key considerations:

- **Authenticated requests**: 5,000 requests per hour (GitHub standard)
- **GraphQL API**: Separate quota system
- **Caching**: Implemented to minimize redundant calls
- **Best Practice**: Use GitHub Actions with built-in tokens for optimal quota management

## Extensibility Points

Developers can extend Release Please through:

1. **Custom Strategies**: Implement new language support
2. **Custom Updaters**: Handle non-standard file formats
3. **Custom Versioning**: Implement alternative versioning schemes
4. **Plugins**: Add pre/post-processing logic
5. **Custom Changelog Notes**: Implement alternative changelog formats

For more information on customization, see [customizing.md](./customizing.md).

## Security Considerations

- **Token Management**: Requires GitHub token with appropriate permissions
- **No Credential Storage**: Does not store credentials
- **API-Only Access**: No local file system access to git history
- **Audit Trail**: All actions visible in GitHub PR/release history

## Summary

Release Please provides a comprehensive, automated solution for managing software releases in GitHub repositories. Its strength lies in:
- **Automation**: Reduces manual release overhead
- **Consistency**: Enforces SemVer and conventional commits
- **Transparency**: All changes reviewed via PRs before release
- **Flexibility**: Supports 20+ languages and custom configurations
- **Scalability**: Works for single libraries and complex monorepos

The tool is production-ready and widely used across the open-source ecosystem, particularly in Google Cloud projects and many community repositories.
