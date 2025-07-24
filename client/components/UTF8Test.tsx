import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const UTF8Test: React.FC = () => {
  const testStrings = [
    "Niño con ñoño en España",
    "José Ángel Núñez Sánchez",
    "María Rodríguez",
    "Clínica Veterinaria",
    "Atención médica",
    "Cirugía especializada",
    "Nutrición animal",
    "Diagnóstico",
    "Peluquería canina"
  ];

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Prueba de Codificación UTF-8</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {testStrings.map((str, index) => (
            <div key={index} className="p-2 bg-gray-50 rounded">
              <span className="font-mono">{str}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h4 className="font-semibold mb-2">Caracteres especiales:</h4>
          <p className="text-sm">á é í ó ú ñ Ñ ü Ü ç Ç</p>
          <p className="text-sm">¿¡ © ® ™ € £ ¥</p>
        </div>
      </CardContent>
    </Card>
  );
};
