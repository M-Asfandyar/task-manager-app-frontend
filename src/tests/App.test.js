import { render, screen } from '@testing-library/react';
import App from '../App';  // Adjust the import path based on your project structure

// Mock Firebase functions
jest.mock('../firebase', () => ({
  requestFirebaseNotificationPermission: jest.fn().mockResolvedValue('mock-fcm-token'),
  onMessageListener: jest.fn().mockImplementation(() => Promise.resolve({
    notification: {
      title: 'Mock Notification',
      body: 'This is a mock notification',
    },
  })),
}));

// Mock data for tasks
const tasks = [
  { _id: '1', title: 'Test Task 1', description: 'Description 1', progress: 50, dependencies: [] },
  { _id: '2', title: 'Test Task 2', description: 'Description 2', progress: 100, dependencies: [] },
];

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(tasks),
  })
);

afterEach(() => {
  global.fetch.mockRestore();  // Restore fetch after each test
});

test('renders tasks in App.js', async () => {
  render(<App />);

  // Wait for the tasks to appear in the document
  expect(await screen.findByText('Test Task 1')).toBeInTheDocument();
  expect(await screen.findByText('Test Task 2')).toBeInTheDocument();
});

test('renders task progress and dependencies', async () => {
  render(<App />);

  // Wait for tasks to appear
  const task1 = await screen.findByText('Test Task 1');
  expect(task1).toBeInTheDocument();

  // Check for task progress 
  expect(screen.getByText('50%')).toBeInTheDocument();

  // Check for task dependencies 
  expect(screen.queryByText('No dependencies')).not.toBeInTheDocument();  
});

test('displays notification when received', async () => {
  render(<App />);

  // Expect the mock notification to be displayed
  expect(await screen.findByText('Mock Notification')).toBeInTheDocument();
  expect(screen.getByText('This is a mock notification')).toBeInTheDocument();
});
