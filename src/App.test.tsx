jest.mock('@mui/icons-material/Delete', () => ({
  __esModule: true,
  default: () => null
}), { virtual: true });

jest.mock('@jsonforms/material-renderers', () => ({
  __esModule: true,
  materialCells: [],
  materialRenderers: []
}));

import App from './App';
import { createRoot } from 'react-dom/client';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(<App />);
  root.unmount();
});
