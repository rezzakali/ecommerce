import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';

export const metadata = {
  title: 'About Us - QuickKart',
  description:
    'Learn more about QuickKart, our mission, and our commitment to providing the best online shopping experience with top-quality products and seamless service.',
};

export default function AboutUs() {
  return (
    <div className="container mx-auto px-6 py-12">
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-lg">
          QuickKart is your one-stop online shopping destination, offering a
          seamless and enjoyable shopping experience with high-quality products
          at unbeatable prices.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8 mt-12">
        <Card>
          <CardHeader>
            <CardTitle>🚀 Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              To revolutionize online shopping by providing fast, affordable,
              and reliable services to customers worldwide.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🌍 Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We aim to be the most customer-centric e-commerce platform,
              offering a diverse range of products with outstanding service.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Meet Our Team
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center justify-center flex-col">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="font-semibold">John Doe</p>
            <p className="text-sm text-gray-500">Founder & CEO</p>
          </div>
          <div className="flex items-center justify-center flex-col">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="font-semibold">Jane Smith</p>
            <p className="text-sm text-gray-500">Chief Marketing Officer</p>
          </div>
        </div>
      </section>

      <section className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Why Choose QuickKart?</h2>
        <p>
          ✔ Fast & Secure Payments | ✔ 24/7 Customer Support | ✔ Wide Range of
          Products
        </p>
      </section>
    </div>
  );
}
