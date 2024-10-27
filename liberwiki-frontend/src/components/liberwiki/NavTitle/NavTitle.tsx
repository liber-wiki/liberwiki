'use client'

import Link from 'next/link'

import * as React from 'react'

import { APIType } from '@/api'

export function NavTitle({ title, children }: { children: React.ReactNode; title: APIType<'Title'> }) {
  return (
    <Link
      className="rounded-md p-2 text-sm hover:bg-accent text-muted-foreground w-full flex justify-between items-center break-all gap-2"
      href={{ pathname: `/titles/${title.slug}` }}
    >
      <span>{children}</span>
      <small className="text-right break-normal">{title.entry_count}</small>
    </Link>
  )
}