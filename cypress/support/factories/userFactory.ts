import { faker } from '@faker-js/faker';

export type TestUser = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  password: string;
};

const randomSuffix = () => faker.string.alphanumeric(6).toLowerCase();
const randomTelephone = () => faker.string.numeric(9);
const randomPassword = (suffix: string) => `Passw0rd!${suffix}`;
const randomEmail = (firstName: string, lastName: string, suffix: string) => {
  const baseEmail = faker.internet.email({
    firstName,
    lastName,
    provider: 'example.com',
  });
  const [localPart, domain] = baseEmail.split('@');
  return `${localPart}.${suffix}@${domain}`;
};

export const buildUser = (overrides: Partial<TestUser> = {}): TestUser => {
  const firstName = overrides.firstName ?? faker.person.firstName();
  const lastName = overrides.lastName ?? faker.person.lastName();
  const suffix = randomSuffix();

  return {
    firstName,
    lastName,
    email: overrides.email ?? randomEmail(firstName, lastName, suffix),
    telephone: overrides.telephone ?? randomTelephone(),
    password: overrides.password ?? randomPassword(suffix),
  };
};
