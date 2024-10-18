'use client'

import { useState } from 'react'

import NavTitle from '@/components/aciksozluk/NavTitle'
import Paginator from '@/components/aciksozluk/Paginator'

import { useAcikSozlukAPI } from '@/lib/serverHooks'

export function LeftColumn() {
  const aciksozluk = useAcikSozlukAPI()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { data: titles } = aciksozluk.titles({ page: currentPage, entry_count__gt: 0 })

  return (
    <>
      <Paginator
        currentPage={currentPage}
        totalPages={titles?.total_pages || 1}
        onPageChange={setCurrentPage}
        className="mt-1"
      />
      <div className="w-full">
        <div className="pb-4">
          {titles?.results?.map((title) => (
            <NavTitle key={title.id} title={title}>
              {title.name}
            </NavTitle>
          ))}
        </div>
      </div>
    </>
  )
}
