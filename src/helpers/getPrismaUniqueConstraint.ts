export const getPrismaUniqueConstraintTarget = (
  meta?: Record<string, unknown>,
): string => {
  if (!meta) return 'Field';
  if ('target' in meta && typeof meta.target === 'string') return meta.target;
  return 'Field';
};
