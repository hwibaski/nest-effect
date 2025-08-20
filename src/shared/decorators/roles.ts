import { Reflector } from '@nestjs/core';
import { AuthUserRole } from '../types';

export const Roles = Reflector.createDecorator<AuthUserRole>();
