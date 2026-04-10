import { motion, useReducedMotion } from "framer-motion";
import felipePhoto from "@/felipe.png";
import laisPhoto from "@/assets/lais-foto.png";

const authors = [
  {
    photo: felipePhoto,
    name: "FELIPE LOPES",
    role: "AUTOR",
    label: "",
    bio: "Advogado com mais de 20 anos de experiência, especialista em Direito Empresarial e Direito do Trabalho, com formação complementar em Direito Eleitoral. Ao longo de sua trajetória, atuou em diferentes funções públicas e institucionais, incluindo a presidência de comissões da OAB Olinda/PE e cargos de assessoria e gestão jurídica em órgãos públicos. Reconhecido por sua atuação estratégica e análise criteriosa de riscos, dedica-se à orientação de empresas e empresários na busca por soluções seguras e bem fundamentadas para os desafios do ambiente empresarial.",
    imgClass: "object-cover",
  },
  {
    photo: laisPhoto,
    name: "LAIS LEITE",
    role: "CO-AUTORA",
    label: "",
    bio: "Advogada com pós-graduações em Direito do Trabalho e Direito Previdenciário. Atua na área trabalhista empresarial, com foco na orientação de empresas na gestão das relações de trabalho. Seu trabalho é voltado à prevenção de passivos trabalhistas e à organização de práticas e procedimentos que proporcionem maior segurança às empresas.",
    imgClass: "object-cover object-top",
  },
];

const AboutSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="autores" className="py-24 lg:py-32 section-dark relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-wine/40 to-transparent" aria-hidden="true" />

      <div className="container mx-auto relative z-10 max-w-5xl">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-wine text-balance">
            OS AUTORES
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
          {authors.map((author, i) => (
            <motion.div
              key={author.name}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col"
            >
              {/* Photo */}
              <div className="w-full max-w-[280px] mx-auto aspect-[3/4] bg-support rounded-xl overflow-hidden relative shadow-2xl mb-5">
                <img
                  src={author.photo}
                  alt={author.name}
                  width={280}
                  height={373}
                  loading="lazy"
                  className={`w-full h-full ${author.imgClass}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Name & role */}
              <div className="text-center mb-4">
                <p className="font-display font-semibold text-off-white text-lg tracking-wide">{author.name}</p>
                <p className="text-gold font-ui text-xs mt-1 tracking-widest uppercase">{author.role}</p>
              </div>

              {/* Bio */}
              <p className="text-off-white/75 font-body text-sm leading-relaxed text-center">
                {author.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
