import BrandPreview, { BrandPreviewProps } from 'components/BrandPreview'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { NextSeo } from 'next-seo'
import { withMetadata } from 'utils/layout'

const ASSETS: BrandPreviewProps[] = [
  {
    name: 'JunoTools',
    id: 'brand',
    url: 'assets/brand.svg',
    Asset: dynamic(() => import('assets/brand.svg')),
  },
  {
    name: 'JunoTools Bust',
    id: 'brand-bust',
    url: 'assets/brand-bust.svg',
    Asset: dynamic(() => import('assets/brand-bust.svg')),
  },
  {
    name: 'JunoTools Text',
    id: 'brand-text',
    url: 'assets/brand-text.svg',
    Asset: dynamic(() => import('assets/brand-text.svg')),
  },
]

const BrandPage: NextPage = () => {
  return (
    <section className="p-8 pb-16 space-y-8">
      <NextSeo title="Brand Assets" />

      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Brand Assets</h1>
        <p>View and download JunoTools brand assets</p>
      </div>

      <hr className="border-white/20" />

      {ASSETS.map((props, i) => (
        <BrandPreview key={`asset-${i}`} {...props} />
      ))}
    </section>
  )
}

export default withMetadata(BrandPage, { center: false })