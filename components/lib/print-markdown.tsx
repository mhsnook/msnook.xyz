import unified from 'unified'
import parse from 'remark-parse'
import remark2react from 'remark-react'

const LazyImage = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	// eslint-disable-next-line @next/next/no-img-element
	<img {...props} loading="lazy" decoding="async" alt={props.alt ?? ''} />
)

const PrintMarkdown = ({ markdown }) =>
	unified()
		.use(parse)
		.use(remark2react, {
			remarkReactComponents: {
				img: LazyImage,
			},
		})
		.processSync(markdown).result as JSX.Element

export default PrintMarkdown
