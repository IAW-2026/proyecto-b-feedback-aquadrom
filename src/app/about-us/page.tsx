import Image from "next/image";
import { Droplets, Zap, ShieldCheck, BookOpenText, Users, Heart } from "lucide-react";

// Sub-componente para los valores de la empresa
function ValueCard({ icon: Icon, title, description }: any) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center transition-all hover:-translate-y-2 hover:shadow-md duration-300">
      <div className="w-16 h-16 bg-[#005BC1]/10 flex items-center justify-center rounded-full mb-6 text-[#005BC1]">
        <Icon size={32} strokeWidth={2.5} />
      </div>
      <h3 className="font-headline text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="font-body text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

// Sub-componente para el equipo técnico
function TeamMember({ name, role, imgSrc }: any) {
  return (
    <div className="flex flex-col items-center group">
      <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-2 border-slate-100 group-hover:border-[#005BC1] shadow-md transition-all duration-300 relative">
        <Image 
          src={imgSrc || "/basic-profile.png"} 
          alt={name} 
          fill 
          className="object-cover grayscale group-hover:grayscale-0 transition-all"
        />
      </div>
      <h4 className="font-headline text-lg text-slate-800 font-bold">{name}</h4>
      <span className="text-xs font-bold text-[#005BC1] bg-[#005BC1]/10 px-4 py-1 rounded-full mt-2 uppercase tracking-tighter">
        {role}
      </span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 rounded-lg">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center overflow-hidden rounded-lg">
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-50 rounded-lg">
            <div className="absolute inset-0 transform scale-[1.8] translate-x-1/4 translate-y-1/4 opacity-30 rounded-lg">
                <Image
                src="/favicon-removebg-preview.png" 
                alt="AguaYa Background"
                fill
                className="object-contain rotate-12 blur-none" 
                priority
                />
            </div>

            <div className="absolute inset-0 bg-linear-to-r from-white via-white/90 to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(0,91,193,0.05),transparent)]"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-2xl space-y-4">
            <h1 className="font-headline text-5xl md:text-6xl font-bold text-[#005BC1] leading-tight">
              Sobre AguaYa
            </h1>
            <p className="font-body text-xl text-slate-600 max-w-lg">
              Llevando frescura, pureza y bienestar a cada rincón de Bahía Blanca con tecnología de punta.
            </p>
          </div>
        </div>
      </section>

      {/* Nuestra Historia - El corazón del proyecto */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="font-headline text-3xl font-bold text-slate-800 flex items-center gap-3">
                <BookOpenText className="text-[#005BC1]" />
                Nuestra Historia
              </h2>
              <div className="space-y-4 text-slate-600 font-body text-lg leading-relaxed">
                 <p>
                    AguaYa nació como un proyecto universitario de la materia Ingeniería de Aplicaciones Web en la UNS.
                </p>
                <p>
                    Vimos la necesidad de muchos bahienses de centralizar y facilitar el acceso a agua pura y de calidad, y monitorear todo el proceso desde la compra hasta el envio y la llegada.
                </p>
              
              </div>
            </div>
            <div className="relative h-100 rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-50">
              <Image 
                src="/aguaya-truck.png" 
                alt="Logística de AguaYa"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Valores */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-headline text-3xl font-bold text-slate-800 mb-4">
                <Heart className="text-[#005BC1] w-10 h-10 mx-auto mb-4" />
                Nuestra Misión y Valores
            </h2>
            <p className="text-slate-500">Trabajamos bajo tres pilares fundamentales que garantizan la excelencia en cada bidón.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon={Droplets} 
              title="Pureza" 
              description="Garantizamos los más altos estándares de filtración y manejo para cada gota que entregamos." 
            />
            <ValueCard 
              icon={Zap} 
              title="Eficiencia" 
              description="Logística inteligente para entregas rápidas y puntuales, optimizando cada recurso del sistema." 
            />
            <ValueCard 
              icon={ShieldCheck} 
              title="Centralización" 
              description="Una plataforma única que conecta a clientes, proveedores y repartidores para una experiencia segura y transparente." 
            />
          </div>
        </div>
      </section>

      {/* Mentes detrás de la frescura - El Equipo */}
      <section className="py-24 bg-white mb-16">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-16">
            <h2 className="font-headline text-3xl font-bold text-slate-800 mb-4 flex justify-center items-center gap-3">
              <Users className="text-[#005BC1]" />
              Mentes detrás de la frescura
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              El equipo técnico y creativo que hace posible la logística inteligente de AguaYa.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-10">  {/*Si es que voy a poner imagenes de nosotros, poner imgSrc="nombrefoto"
                                                                        Falta ver si pongo link al github*/}
            <TeamMember name="León Álvarez" role="Buyer App" />
            <TeamMember name="Agustín Poza" role="Seller App" />
            <TeamMember name="Jeremías Guttmann" role="Delivery App" />
            <TeamMember name="Agustín Condorí" role="Payments App" />
            <TeamMember name="Gregorio Plunkett" role="Feedback App" />

          </div>
        </div>
      </section>

  
    </div>
  );
}