'use client';

import { UserInterface } from '../users/user.interface';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import moment from 'moment';

const Page = ({ user }: { user: UserInterface }) => {
  return (
    <Card className="w-full mx-auto shadow-lg rounded-xl py-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Left Side - Avatar & Role */}
        <div className="flex flex-col items-center justify-center md:items-center w-full md:w-1/3">
          <Avatar className="w-20 h-20">
            <AvatarImage src="/avatar.png" alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <CardHeader className="text-center md:text-left">
            <CardTitle className="text-xl font-semibold">{user.name}</CardTitle>
            <Badge variant="outline">{user.role.toUpperCase()}</Badge>
          </CardHeader>
        </div>

        {/* Right Side - User Details */}
        <CardContent className="w-full md:w-2/3 space-y-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Phone:</span> {user.phone}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Address:</span> {user.address}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Auth Provider:</span>{' '}
            {user.authProvider}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Created At:</span>{' '}
            {moment(user.createdAt).format('lll')}
          </p>
        </CardContent>
      </div>
    </Card>
  );
};

export default Page;
