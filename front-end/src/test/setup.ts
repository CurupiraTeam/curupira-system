import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Desmonta os componentes renderizados após cada teste
afterEach(() => {
  cleanup();
});
