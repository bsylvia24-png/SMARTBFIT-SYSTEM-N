import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shirt, Sparkles, ShieldCheck, Heart, BadgeDollarSign, Truck } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
    }
  };

  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-[#8B5E3C]" />,
      title: 'AI Body Measurement',
      desc: 'Get highly accurate measurements instantly using our proprietary vision scan or guided size calculator.'
    },
    {
      icon: <Shirt className="h-6 w-6 text-[#8B5E3C]" />,
      title: 'Smart Size Recommendation',
      desc: 'Compare your measurements to real catalog metrics for perfect, tailor-made garment suggestions.'
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-[#8B5E3C]" />,
      title: 'Verified Fashion Sellers',
      desc: 'Shop exclusively from audited, verified boutiques and luxury designers committed to premium fits.'
    },
    {
      icon: <Heart className="h-6 w-6 text-[#8B5E3C]" />,
      title: 'Curated Wishlist',
      desc: 'Save your top-rated picks and monitor when items in your recommended size go on exclusive sale.'
    },
    {
      icon: <BadgeDollarSign className="h-6 w-6 text-[#8B5E3C]" />,
      title: 'Secure Payments',
      desc: 'Enjoy modern luxury checkout with premium encryption, instant card processing, and security guarantees.'
    },
    {
      icon: <Truck className="h-6 w-6 text-[#8B5E3C]" />,
      title: 'Order Tracking',
      desc: 'Follow your bespoke garments from the tailor to your doorstep with real-time status updates.'
    }
  ];

  return (
    <div className="bg-[#F5F1EB] min-h-screen text-[#2E1F16]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#8B5E3C]/30 text-xs font-semibold tracking-wider text-[#8B5E3C] uppercase bg-[#8B5E3C]/5">
              <Sparkles className="h-3 w-3" /> Next-Gen Fashion Tech
            </span>
            <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2E1F16] leading-tight">
              Find Clothes That <br />
              <span className="text-[#8B5E3C]">Actually Fit.</span>
            </h1>
            <p className="font-inter text-base sm:text-lg text-[#4A2C2A] leading-relaxed max-w-xl">
              AI-powered body measurement technology helping you discover perfectly fitting outfits from verified sellers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/fit-recommendation"
                className="px-8 py-4 bg-[#2E1F16] hover:bg-[#8B5E3C] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                Get Started
              </Link>
              <a
                href="#features"
                className="px-8 py-4 border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C]/5 font-semibold rounded-full transition-all duration-300 text-center"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          {/* AI Scan Mock Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-[420px] aspect-[4/5] bg-gradient-to-tr from-[#2E1F16] to-[#4A2C2A] rounded-3xl p-1 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent"></div>
              
              {/* Scan effect bar */}
              <div className="absolute left-0 right-0 top-0 h-1 bg-[#C4A484] shadow-[0_0_15px_#C4A484] animate-bounce z-10" style={{ animationDuration: '4s' }}></div>

              <div className="w-full h-full bg-[#2E1F16]/95 rounded-[22px] p-6 flex flex-col justify-between overflow-hidden relative">
                {/* Simulated Mesh grid */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#C4A484_1px,transparent_1px),linear-gradient(to_bottom,#C4A484_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                <div className="flex justify-between items-center z-10">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
                    <span className="text-[10px] font-mono tracking-widest text-[#C4A484] uppercase">AI FIT SCANNER</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#C4A484]/65">LIDAR: READY</span>
                </div>

                <div className="my-auto flex flex-col items-center justify-center py-8 z-10">
                  <div className="relative w-48 h-64 border border-[#C4A484]/20 rounded-2xl flex items-center justify-center bg-[#F5F1EB]/5 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80" 
                      alt="African Fashion Model" 
                      className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2E1F16] via-transparent to-transparent"></div>
                    {/* Simulated laser scan bounding boxes */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#C4A484]"></div>
                    <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#C4A484]"></div>
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#C4A484]"></div>
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#C4A484]"></div>
                    
                    <span className="absolute bottom-2 font-mono text-[9px] text-[#C4A484]">98.7% ACCURACY RATING</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#F5F1EB]/5 p-3 rounded-xl border border-[#C4A484]/15 z-10">
                  <div className="text-center">
                    <span className="block text-[8px] font-mono text-[#C4A484]/70">CHEST</span>
                    <span className="font-poppins font-bold text-sm text-white">38.4 in</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[8px] font-mono text-[#C4A484]/70">WAIST</span>
                    <span className="font-poppins font-bold text-sm text-white">32.1 in</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[8px] font-mono text-[#C4A484]/70">HIPS</span>
                    <span className="font-poppins font-bold text-sm text-white">39.5 in</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white border-y border-[#C4A484]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-[#8B5E3C] tracking-widest uppercase">System Capabilities</span>
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-[#2E1F16]">Unrivaled Custom Fit Platform</h2>
            <p className="font-inter text-sm sm:text-base text-[#4A2C2A]/80">
              Designed for luxury retailers and tailored specifically to eliminate the guesswork of online apparel shopping.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-8 bg-[#F5F1EB]/50 border border-[#C4A484]/25 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 group"
              >
                <div className="p-3 bg-white rounded-xl inline-block shadow-md group-hover:bg-[#8B5E3C] group-hover:text-white transition-colors duration-300 mb-6">
                  {feat.icon}
                </div>
                <h3 className="font-poppins text-lg font-bold text-[#2E1F16] mb-3">{feat.title}</h3>
                <p className="font-inter text-sm text-[#4A2C2A] leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-[#F5F1EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-bold text-[#8B5E3C] tracking-widest uppercase">Simple Walkthrough</span>
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-[#2E1F16]">How Smart Fit Reinvents Fitting</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="h-16 w-16 bg-[#2E1F16] text-[#F5F1EB] rounded-full flex items-center justify-center font-poppins font-bold text-xl mx-auto mb-6 shadow-md border-4 border-[#C4A484]/40">
                1
              </div>
              <h3 className="font-poppins text-xl font-bold mb-3">Submit Measurements</h3>
              <p className="font-inter text-sm text-[#4A2C2A] leading-relaxed max-w-xs mx-auto">
                Fill in basic dimensions manually or upload a picture. Our AI processes your body metrics automatically.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="h-16 w-16 bg-[#8B5E3C] text-white rounded-full flex items-center justify-center font-poppins font-bold text-xl mx-auto mb-6 shadow-md border-4 border-[#C4A484]/40">
                2
              </div>
              <h3 className="font-poppins text-xl font-bold mb-3">AI Fits Analysis</h3>
              <p className="font-inter text-sm text-[#4A2C2A] leading-relaxed max-w-xs mx-auto">
                The algorithm matches your unique silhouette against the seller's verified design tables instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="h-16 w-16 bg-[#C4A484] text-[#2E1F16] rounded-full flex items-center justify-center font-poppins font-bold text-xl mx-auto mb-6 shadow-md border-4 border-[#C4A484]/40">
                3
              </div>
              <h3 className="font-poppins text-xl font-bold mb-3">Receive Tailored Looks</h3>
              <p className="font-inter text-sm text-[#4A2C2A] leading-relaxed max-w-xs mx-auto">
                Browse perfectly matched items, add to cart, and enjoy fits guaranteed not to require returns.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
