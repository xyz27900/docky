import { ContainerData } from '@common/models/container.model';

const isValidPairs = (items: any): items is [string, string][] => {
  return Array.isArray(items) && items.every(isValidPair);
};

const isValidPair = (items: any): items is [string, string] => {
  return Array.isArray(items) && items.length === 2 && items.every(item => typeof item === 'string');
};

export const parseConfig = (content: string): ContainerData => {
  const parsed = JSON.parse(content);
  const { image, tag, ports, volumes, variables } = parsed;

  if (typeof image !== 'string' || image.trim().length === 0) {
    throw new Error('Invalid image name');
  }

  if (typeof tag !== 'string' || tag.trim().length === 0) {
    throw new Error('Invalid tag');
  }

  if (!isValidPairs(ports)) {
    throw new Error('Invalid ports section format');
  }

  if (!isValidPairs(volumes)) {
    throw new Error('Invalid volumes section format');
  }


  if (!isValidPairs(variables)) {
    throw new Error('Invalid variables section format');
  }

  return {
    image,
    tag,
    ports,
    volumes,
    variables,
  };
};
