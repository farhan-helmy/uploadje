import { useParams } from '@remix-run/react';
import type { App } from '@shared/types/app';
import type { Image } from '@shared/types/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/primitives/Table';
import { useCustomQuery } from '~/hooks/useCustomQuery';

dayjs.extend(relativeTime);

export default function Page() {
  const { appSlug } = useParams();

  const { data: apps = [] } = useCustomQuery<Array<App & {id: string}>>({
    queryKey: ['apps'],
    queryFn: ()=>fetch('/resources/app').then(async (res) => res.json())
  });

  const currentRoute = apps && apps?.find(i=>i.id === appSlug);

  const { data: images = [] } = useCustomQuery<Image[]>({
    queryKey: ['images', currentRoute],
    queryFn: ()=>fetch('/resources/image', {
      headers: {
        'UPLOADJE_APP_ID': currentRoute!.appKey,
        'UPLOADJE_APP_SECRET': currentRoute!.appSecret,
      }
    }).then(async (res) => res.json())
  });

  return (
    <>
      <FilesTable images={images} />
    </>
  );
}

function FilesTable({ images }: {images: Image[]}) {
  return (
    <div>
      <Table className="appearance-none font-normal">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className='text-right'>Date Added</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {images.map(image=>(
            <TableRow key={image.id}>
              <TableCell className='flex items-center gap-2 text-ellipsis whitespace-pre'>
                <img className='h-7 aspect-[3/2] rounded-lg object-cover border border-black-4' src={image.path} alt={image.path} />
                <span className='truncate underline'>{image.path}</span>
              </TableCell>
              <TableCell className="min-w-[120px]">{image.size}</TableCell>
              <TableCell className="min-w-[160px] text-right">{dayjs().to(image.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
