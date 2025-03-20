#!/bin/bash

# Stop on any error
set -e

# Configuration
OLD_DIR="language-quest"
NEW_DIR="fabletongue"
BACKUP_DIR="pre-rename-backup"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [[ ! -d "$OLD_DIR" ]]; then
    log_error "Directory $OLD_DIR not found. Please run this script from the parent directory."
    exit 1
fi

# Create backup
log_info "Creating backup..."
if [[ -d "$BACKUP_DIR" ]]; then
    log_warning "Backup directory already exists. Removing..."
    rm -rf "$BACKUP_DIR"
fi
cp -r "$OLD_DIR" "$BACKUP_DIR"

# Rename directory
log_info "Renaming directory..."
if [[ -d "$NEW_DIR" ]]; then
    log_error "Target directory $NEW_DIR already exists. Please remove it first."
    exit 1
fi
mv "$OLD_DIR" "$NEW_DIR"

# Update package.json
log_info "Updating package.json..."
sed -i "s/\"name\": \"$OLD_DIR\"/\"name\": \"$NEW_DIR\"/" "$NEW_DIR/package.json"

# Update import paths in TypeScript/JavaScript files
log_info "Updating import paths..."
find "$NEW_DIR" -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | while read -r file; do
    sed -i "s|from '$OLD_DIR|from '$NEW_DIR|g" "$file"
    sed -i "s|require('$OLD_DIR|require('$NEW_DIR|g" "$file"
done

# Update documentation references
log_info "Updating documentation..."
find "$NEW_DIR/docs" -type f -name "*.md" | while read -r file; do
    sed -i "s|$OLD_DIR|$NEW_DIR|g" "$file"
done

# Update configuration files
log_info "Updating configuration files..."
find "$NEW_DIR" -type f -name "*.json" -o -name "*.yaml" -o -name "*.yml" | while read -r file; do
    sed -i "s|$OLD_DIR|$NEW_DIR|g" "$file"
done

# Update environment files
log_info "Updating environment files..."
find "$NEW_DIR" -type f -name ".env*" | while read -r file; do
    sed -i "s|LANGUAGE_QUEST_|FABLETONGUE_|g" "$file"
done

# Clean up node_modules and reinstall if present
if [[ -d "$NEW_DIR/node_modules" ]]; then
    log_info "Reinstalling dependencies..."
    cd "$NEW_DIR"
    rm -rf node_modules package-lock.json
    npm install
fi

log_info "Directory rename complete!"
echo -e "${GREEN}Next steps:${NC}"
echo "1. Update any CI/CD configurations"
echo "2. Update deployment scripts"
echo "3. Update any external documentation"
echo "4. Test the application"
echo "5. Commit the changes"

# Optional: Remove backup
read -p "Remove backup directory? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$BACKUP_DIR"
    log_info "Backup removed."
fi 