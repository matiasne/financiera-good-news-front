import Icon from '@/components/base/Icons'

export function Warning({text = '', children}) {
	return (
		<p className='bg-red-200 text-red p-2 rounded-lg m-0 mb-4 flex gap-2 justify-start'>
			<Icon glyph='info' className={'text-icon-sm'} />
			{text || children}
		</p>
	)
}
