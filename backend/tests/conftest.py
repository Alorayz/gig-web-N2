"""
Pytest configuration and shared fixtures for GIG ZipFinder tests
"""

import pytest
import os


def pytest_configure(config):
    """Configure pytest with custom settings"""
    # Set environment variable for tests
    os.environ.setdefault('EXPO_PUBLIC_BACKEND_URL', 'https://zip-search-pro.preview.emergentagent.com')


@pytest.fixture(scope="session")
def base_url():
    """Return the base URL for API calls"""
    return os.environ.get('EXPO_PUBLIC_BACKEND_URL', 'https://zip-search-pro.preview.emergentagent.com')
