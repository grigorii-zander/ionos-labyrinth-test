import { SetMetadata } from '@nestjs/common'

export const PUBLIC_ROUTE_KEY = 'public_route_key'
export const Public = () => SetMetadata(PUBLIC_ROUTE_KEY, true)
