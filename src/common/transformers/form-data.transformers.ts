import { Transform, plainToInstance } from 'class-transformer';

export const JsonTransform = (cls?: new (...args: any[]) => any) =>
  Transform(({ value }) => {
    let parsed = value;

    if (typeof value === 'string') {
      try {
        parsed = JSON.parse(value);
      } catch {
        return [value];
      }
    }

    if (!Array.isArray(parsed)) return [];

    if (cls) return plainToInstance(cls, parsed);

    return parsed;
  });

export const NumberTransform = () =>
  Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : undefined,
  );

export const BooleanTransform = () =>
  Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  });