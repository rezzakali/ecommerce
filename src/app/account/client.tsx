'use client';

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
import { Edit3 } from 'lucide-react';
import moment from 'moment';
import React, { useState } from 'react';
import { UserInterface } from '../dashboard/users/user.interface';
import EditProfileDialog from './edit-profile-dialog';

const Page = ({ user }: { user: UserInterface }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <div className="m-6">
        <Card className="container mx-auto shadow rounded-xl relative p-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Left Side - Avatar & Role */}
            <div className="flex flex-col items-center justify-center md:items-center w-full md:w-1/3">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/avatar.png" alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <CardHeader className="text-center md:text-left">
                <CardTitle className="text-xl font-semibold">
                  {user.name}
                </CardTitle>
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
          <Edit3
            className="absolute top-3 right-3 cursor-pointer"
            onClick={() => setOpen(true)}
          />
        </Card>
      </div>

      {open && <EditProfileDialog open={open} setOpen={setOpen} user={user} />}
    </React.Fragment>
  );
};

export default Page;
