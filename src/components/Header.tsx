'use client';

import {
  Avatar,
  Button,
  Listbox,
  ListboxItem,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User as UserIcon,
} from '@heroui/react';
import { MelonLogo } from './MelonLogo';
import { LogOut, NotepadText, UserRound, Wallet, Send } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Search } from './Search';
import pkceChallenge from 'pkce-challenge';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Introspect } from '@/utils/types';
import { HttpCode } from '@/utils/types';
import { useStore } from '@/utils/store';
import { getUserRequest } from '@/api/userApi';

export function Header() {
  const router = useRouter();

  const [loginStatus, setLoginStatus] = useState(
    localStorage.getItem('login_status') != undefined &&
      localStorage.getItem('login_status') === 'true',
  );

  const user = useStore((state) => state.user);
  const avatarVersion = useStore((state) => state.avatarVersion);
  const updateUser = useStore((state) => state.updateUser);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    fetch(`${process.env.NEXT_PUBLIC_AUTH_URI}/introspect?token=${token}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((result) => {
        const introspect: Introspect = result;
        if (introspect.active && introspect.user) {
          getUserRequest(introspect.user.id).then((result) => {
            if (result.code === HttpCode.OK) {
              localStorage.setItem('user', JSON.stringify(result.data));
              updateUser(result.data);
            }
          });
        } else {
          setLoginStatus(false);
          clearLocalStorageCache();
        }
      });
  }, []);

  async function login() {
    const { code_challenge, code_verifier } = await pkceChallenge();
    localStorage.setItem('code_verifier', code_verifier);
    window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URI}/oauth2/authorize?response_type=code&client_id=melon&scope=profile&redirect_uri=http://localhost:3000/login&code_challenge=${code_challenge}&code_challenge_method=S256`;
  }

  function clearLocalStorageCache() {
    localStorage.setItem('login_status', 'false');
    localStorage.removeItem('access_token');
    localStorage.removeItem('code_verifier');
    localStorage.removeItem('user');
  }

  function logout() {
    setLoginStatus(false);
    clearLocalStorageCache();
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URI}/logout`;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-16 z-10">
      <Navbar maxWidth="full">
        <NavbarBrand>
          <MelonLogo />
          <p className="font-bold text-inherit">Melon</p>
        </NavbarBrand>
        <Search />
        <NavbarContent justify="end">
          {loginStatus && (
            <NavbarItem>
              <Button onPress={() => router.push(`/upload-video`)} color="success" variant="faded">
                <Send size={18} />
                Upload video
              </Button>
            </NavbarItem>
          )}
          <NavbarItem>
            <ThemeSwitcher />
          </NavbarItem>
          <>
            {loginStatus ? (
              <NavbarItem>
                <Popover showArrow offset={10} placement="bottom">
                  <PopoverTrigger>
                    <Avatar
                      radius="lg"
                      isBordered
                      src={`${user.avatarUrl}?v=${avatarVersion}`}
                      key={user.id}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-4">
                    <UserIcon
                      avatarProps={{
                        src: `${user.avatarUrl}?v=${avatarVersion}`,
                      }}
                      description="General User"
                      name={user.nickname}
                      key={user.id}
                    />
                    <Listbox aria-label="Actions" className="mt-2">
                      <ListboxItem
                        key="user"
                        startContent={<UserRound size={18} />}
                        onPress={() => router.push('/user/self')}
                      >
                        个人主页
                      </ListboxItem>
                      <ListboxItem
                        key="post"
                        startContent={<NotepadText size={18} />}
                      >
                        我的投稿
                      </ListboxItem>
                      <ListboxItem
                        key="wallet"
                        startContent={<Wallet size={18} />}
                      >
                        我的钱包
                      </ListboxItem>
                      <ListboxItem
                        key="logout"
                        className="text-danger"
                        color="danger"
                        startContent={<LogOut size={18} />}
                        onPress={logout}
                      >
                        Logout
                      </ListboxItem>
                    </Listbox>
                  </PopoverContent>
                </Popover>
              </NavbarItem>
            ) : (
              <></>
            )}
          </>
          <>
            {loginStatus ? (
              <></>
            ) : (
              <NavbarItem>
                <Button color="primary" variant="ghost" onPress={login}>
                  Log in
                </Button>
              </NavbarItem>
            )}
          </>
          <>
            {loginStatus ? (
              <></>
            ) : (
              <NavbarItem>
                <Button
                  color="success"
                  variant="ghost"
                  onPress={() => router.push('/sign-up')}
                >
                  Sign up
                </Button>
              </NavbarItem>
            )}
          </>
        </NavbarContent>
      </Navbar>
    </div>
  );
}
