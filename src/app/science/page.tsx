import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "The Science of Enzyme Skincare",
  description: "Learn how enzyme-based skincare works. Discover the science behind bio-active enzymes and natural skin renewal.",
};

export default function SciencePage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Science", url: "/science" }]} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto prose prose-neutral">
          <h1>The Science of Enzyme Skincare</h1>
          <h2>What Are Enzymes?</h2>
          <p>
            Enzymes are proteins that act as biological catalysts, speeding up chemical reactions in the body.
            In skincare, proteolytic enzymes break down the keratin protein that holds dead skin cells together,
            allowing them to be gently sloughed away without the irritation caused by physical or acid exfoliants.
          </p>
          <h2>How Enzymes Work in Your Skin</h2>
          <ol>
            <li><strong>Activation:</strong> When applied to damp skin, enzymes become active and begin breaking down dead skin cell bonds.</li>
            <li><strong>Renewal:</strong> As dead cells are gently removed, fresh, healthy skin cells are revealed.</li>
            <li><strong>Absorption:</strong> With the skin barrier clear, your serums and moisturizers can penetrate more effectively.</li>
            <li><strong>Repair:</strong> Over time, regular enzyme use supports your skin natural repair processes.</li>
          </ol>
          <h2>Our Enzyme Technology</h2>
          <p>
            We use plant-derived enzymes including papain (from papaya), bromelain (from pineapple), and
            pumpkin enzymes. Our proprietary stabilization technology ensures these delicate enzymes remain
            active in the bottle and effective on your skin.
          </p>
          <div className="mt-8 not-prose text-center">
            <Link href="/products"><Button size="lg">Browse Products</Button></Link>
          </div>
        </div>
      </div>
    </>
  );
}