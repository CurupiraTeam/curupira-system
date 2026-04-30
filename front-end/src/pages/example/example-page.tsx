import React, { useEffect, useState } from 'react';
import { ExampleService } from '../../core/services/example.service';

const ExamplePage: React.FC = () => {
  const [message, setMessage] = useState<string>('Loading...');

  useEffect(() => {
    ExampleService.getHello().then(setMessage);
  }, []);

  return (
    <div className="example-page">
      <h1>Curupira System</h1>
      <p>{message}</p>
      <button onClick={() => ExampleService.createItem({ name: 'Example Item' })}>
        Create Example Item
      </button>
    </div>
  );
};

export default ExamplePage;
