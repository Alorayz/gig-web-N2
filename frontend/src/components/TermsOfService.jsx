import React from 'react';
import { useTranslation } from 'react-i18next';

export const TermsOfService = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const content = {
    en: {
      title: "Terms of Service",
      lastUpdated: "Last Updated: December 20, 2025",
      intro: "Please read these Terms of Service ('Terms') carefully before using GIG ZipFinder ('Service', 'we', 'our', or 'us').",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: "By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service."
        },
        {
          title: "2. Description of Service",
          content: `GIG ZipFinder is a tool that:
• SUGGESTS ZIP codes with potential availability for gig economy apps based on AI analysis
• Provides free phone numbers for registration purposes
• Offers step-by-step guides for opening accounts on delivery platforms

IMPORTANT DISCLAIMERS:
• We SUGGEST ZIP codes based on AI analysis - we do NOT sell, guarantee, or control availability
• Due to HIGH DEMAND, suggested ZIP codes may NOT remain open for long
• We do NOT guarantee that suggested codes will work or result in account approval
• Results may vary significantly and depend on factors beyond our control
• We provide suggestions as a help tool only`
        },
        {
          title: "3. No Affiliation with Third Parties",
          content: `CRITICAL DISCLAIMER: GIG ZipFinder is NOT affiliated with, partnered with, sponsored by, or endorsed by:
• Instacart
• DoorDash
• Spark Driver
• Walmart
• Or any other gig economy platform mentioned in our service

We are an INDEPENDENT help tool. We have no business relationship with these companies. These companies do not endorse, support, or have any involvement with our service.`
        },
        {
          title: "4. No Guarantees or Warranties",
          content: `THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE SPECIFICALLY DISCLAIM:
• Guarantees of ZIP code availability
• Guarantees of account approval
• Guarantees that suggested codes will remain open
• Warranties of merchantability or fitness for a particular purpose

Due to high demand in gig economy platforms and constant changes in their policies, availability changes rapidly and unpredictably. Our AI provides suggestions based on data analysis, but we cannot and do not guarantee results.`
        },
        {
          title: "5. User Responsibilities",
          content: `You agree to:
• Provide accurate information when using our Service
• Comply with all applicable laws and regulations
• Use the Service only for lawful purposes
• Not misrepresent your relationship with us to third parties
• Understand that our suggestions do not guarantee approval`
        },
        {
          title: "6. Payment Terms",
          content: `• Service cost: $20.00 USD per app (one-time payment)
• All payments processed securely through Stripe
• WE DO NOT store, save, or have access to your payment or credit card information
• Stripe maintains PCI-DSS compliance
• Payments are non-refundable due to the digital nature of our service
• You understand you are paying for suggestions and guides, not guaranteed results`
        },
        {
          title: "7. Limitation of Liability",
          content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW:
• We are not liable for any damages arising from use of our Service
• We are not responsible if suggested ZIP codes don't work
• We are not liable for decisions made by third-party platforms (Instacart, DoorDash, etc.)
• Our total liability shall not exceed the amount you paid for the Service ($20.00 USD)
• We are not responsible for changes in third-party platform policies`
        },
        {
          title: "8. Privacy and Data",
          content: `• Your use of the Service is also governed by our Privacy Policy
• We do NOT store payment or credit card data
• Payment processing is handled exclusively by Stripe
• We implement security measures but cannot guarantee absolute security
• We do not share your data with third-party gig platforms`
        },
        {
          title: "9. Modifications to Service",
          content: "We reserve the right to modify or discontinue the Service at any time without notice. We are not liable for any modification, suspension, or discontinuation of the Service."
        },
        {
          title: "10. Governing Law",
          content: "These Terms shall be governed by and construed in accordance with the laws of the United States of America, without regard to its conflict of law provisions."
        },
        {
          title: "11. Changes to Terms",
          content: "We reserve the right to update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms."
        },
        {
          title: "12. Contact Information",
          content: `For questions about these Terms, contact us at:
Email: legal@gigzipfinder.com
Address: GIG ZipFinder, United States`
        }
      ]
    },
    es: {
      title: "Términos de Servicio",
      lastUpdated: "Última Actualización: 20 de Diciembre, 2025",
      intro: "Por favor lee estos Términos de Servicio ('Términos') cuidadosamente antes de usar GIG ZipFinder ('Servicio', 'nosotros', 'nuestro' o 'nos').",
      sections: [
        {
          title: "1. Aceptación de Términos",
          content: "Al acceder o usar nuestro Servicio, aceptas estar sujeto a estos Términos. Si no estás de acuerdo con cualquier parte de los términos, no puedes acceder al Servicio."
        },
        {
          title: "2. Descripción del Servicio",
          content: `GIG ZipFinder es una herramienta que:
• SUGIERE códigos ZIP con disponibilidad potencial para apps de gig economy basándose en análisis de IA
• Proporciona números de teléfono gratuitos para propósitos de registro
• Ofrece guías paso a paso para abrir cuentas en plataformas de delivery

AVISOS IMPORTANTES:
• SUGERIMOS códigos ZIP basados en análisis de IA - NO vendemos, garantizamos ni controlamos la disponibilidad
• Debido a la ALTA DEMANDA, los códigos ZIP sugeridos pueden NO permanecer abiertos por mucho tiempo
• NO garantizamos que los códigos sugeridos funcionen o resulten en aprobación de cuenta
• Los resultados pueden variar significativamente y dependen de factores fuera de nuestro control
• Proporcionamos sugerencias solo como herramienta de ayuda`
        },
        {
          title: "3. Sin Afiliación con Terceros",
          content: `AVISO CRÍTICO: GIG ZipFinder NO está afiliado con, no es socio de, no está patrocinado por, ni respaldado por:
• Instacart
• DoorDash
• Spark Driver
• Walmart
• O cualquier otra plataforma de gig economy mencionada en nuestro servicio

Somos una herramienta de ayuda INDEPENDIENTE. No tenemos relación comercial con estas compañías. Estas compañías no respaldan, apoyan ni tienen ninguna participación en nuestro servicio.`
        },
        {
          title: "4. Sin Garantías",
          content: `EL SERVICIO SE PROPORCIONA "TAL CUAL" SIN GARANTÍAS DE NINGÚN TIPO. ESPECÍFICAMENTE RENUNCIAMOS A:
• Garantías de disponibilidad de código ZIP
• Garantías de aprobación de cuenta
• Garantías de que los códigos sugeridos permanecerán abiertos
• Garantías de comerciabilidad o idoneidad para un propósito particular

Debido a la alta demanda en plataformas de gig economy y cambios constantes en sus políticas, la disponibilidad cambia rápida e impredeciblemente. Nuestra IA proporciona sugerencias basadas en análisis de datos, pero no podemos ni garantizamos resultados.`
        },
        {
          title: "5. Responsabilidades del Usuario",
          content: `Aceptas:
• Proporcionar información precisa al usar nuestro Servicio
• Cumplir con todas las leyes y regulaciones aplicables
• Usar el Servicio solo para propósitos legales
• No tergiversar tu relación con nosotros ante terceros
• Entender que nuestras sugerencias no garantizan aprobación`
        },
        {
          title: "6. Términos de Pago",
          content: `• Costo del servicio: $20.00 USD por app (pago de $20)
• Todos los pagos procesados de forma segura a través de Stripe
• NO almacenamos, guardamos ni tenemos acceso a tu información de pago o tarjeta de crédito
• Stripe mantiene cumplimiento PCI-DSS
• Los pagos no son reembolsables debido a la naturaleza digital de nuestro servicio
• Entiendes que estás pagando por sugerencias y guías, no por resultados garantizados`
        },
        {
          title: "7. Limitación de Responsabilidad",
          content: `EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY:
• No somos responsables de ningún daño que surja del uso de nuestro Servicio
• No somos responsables si los códigos ZIP sugeridos no funcionan
• No somos responsables de las decisiones tomadas por plataformas de terceros (Instacart, DoorDash, etc.)
• Nuestra responsabilidad total no excederá el monto que pagaste por el Servicio ($20.00 USD)
• No somos responsables de cambios en las políticas de plataformas de terceros`
        },
        {
          title: "8. Privacidad y Datos",
          content: `• Tu uso del Servicio también está regido por nuestra Política de Privacidad
• NO almacenamos datos de pago o tarjetas de crédito
• El procesamiento de pagos es manejado exclusivamente por Stripe
• Implementamos medidas de seguridad pero no podemos garantizar seguridad absoluta
• No compartimos tus datos con plataformas de gig de terceros`
        },
        {
          title: "9. Modificaciones al Servicio",
          content: "Nos reservamos el derecho de modificar o discontinuar el Servicio en cualquier momento sin aviso. No somos responsables de ninguna modificación, suspensión o discontinuación del Servicio."
        },
        {
          title: "10. Ley Aplicable",
          content: "Estos Términos se regirán e interpretarán de acuerdo con las leyes de los Estados Unidos de América, sin tener en cuenta sus disposiciones sobre conflicto de leyes."
        },
        {
          title: "11. Cambios a los Términos",
          content: "Nos reservamos el derecho de actualizar estos Términos en cualquier momento. El uso continuado del Servicio después de los cambios constituye aceptación de los nuevos Términos."
        },
        {
          title: "12. Información de Contacto",
          content: `Para preguntas sobre estos Términos, contáctanos en:
Email: legal@gigzipfinder.com
Dirección: GIG ZipFinder, Estados Unidos`
        }
      ]
    },
    pt: {
      title: "Termos de Serviço",
      lastUpdated: "Última Atualização: 20 de Dezembro, 2025",
      intro: "Por favor, leia estes Termos de Serviço ('Termos') cuidadosamente antes de usar o GIG ZipFinder ('Serviço', 'nós', 'nosso' ou 'nos').",
      sections: [
        {
          title: "1. Aceitação dos Termos",
          content: "Ao acessar ou usar nosso Serviço, você concorda em estar vinculado a estes Termos. Se você discordar de qualquer parte dos termos, não poderá acessar o Serviço."
        },
        {
          title: "2. Descrição do Serviço",
          content: `GIG ZipFinder é uma ferramenta que:
• SUGERE códigos ZIP com disponibilidade potencial para apps de gig economy baseado em análise de IA
• Fornece números de telefone gratuitos para fins de registro
• Oferece guias passo a passo para abrir contas em plataformas de delivery

AVISOS IMPORTANTES:
• SUGERIMOS códigos ZIP baseados em análise de IA - NÃO vendemos, garantimos ou controlamos a disponibilidade
• Devido à ALTA DEMANDA, os códigos ZIP sugeridos podem NÃO permanecer abertos por muito tempo
• NÃO garantimos que os códigos sugeridos funcionarão ou resultarão em aprovação de conta
• Os resultados podem variar significativamente e dependem de fatores além do nosso controle
• Fornecemos sugestões apenas como ferramenta de ajuda`
        },
        {
          title: "3. Sem Afiliação com Terceiros",
          content: `AVISO CRÍTICO: GIG ZipFinder NÃO é afiliado com, não é parceiro de, não é patrocinado por, nem endossado por:
• Instacart
• DoorDash
• Spark Driver
• Walmart
• Ou qualquer outra plataforma de gig economy mencionada em nosso serviço

Somos uma ferramenta de ajuda INDEPENDENTE. Não temos relacionamento comercial com essas empresas. Essas empresas não endossam, apoiam ou têm qualquer envolvimento com nosso serviço.`
        },
        {
          title: "4. Sem Garantias",
          content: `O SERVIÇO É FORNECIDO "COMO ESTÁ" SEM GARANTIAS DE QUALQUER TIPO. ESPECIFICAMENTE RENUNCIAMOS A:
• Garantias de disponibilidade de código ZIP
• Garantias de aprovação de conta
• Garantias de que os códigos sugeridos permanecerão abertos
• Garantias de comercialização ou adequação para um propósito específico

Devido à alta demanda em plataformas de gig economy e mudanças constantes em suas políticas, a disponibilidade muda rápida e imprevisavelmente. Nossa IA fornece sugestões baseadas em análise de dados, mas não podemos nem garantimos resultados.`
        },
        {
          title: "5. Responsabilidades do Usuário",
          content: `Você concorda em:
• Fornecer informações precisas ao usar nosso Serviço
• Cumprir com todas as leis e regulamentos aplicáveis
• Usar o Serviço apenas para fins legais
• Não deturpar seu relacionamento conosco para terceiros
• Entender que nossas sugestões não garantem aprovação`
        },
        {
          title: "6. Termos de Pagamento",
          content: `• Custo do serviço: $20.00 USD por app (pagamento único)
• Todos os pagamentos processados com segurança através do Stripe
• NÃO armazenamos, guardamos ou temos acesso às suas informações de pagamento ou cartão de crédito
• Stripe mantém conformidade PCI-DSS
• Os pagamentos não são reembolsáveis devido à natureza digital do nosso serviço
• Você entende que está pagando por sugestões e guias, não por resultados garantidos`
        },
        {
          title: "7. Limitação de Responsabilidade",
          content: `NA MÁXIMA EXTENSÃO PERMITIDA POR LEI:
• Não somos responsáveis por quaisquer danos decorrentes do uso do nosso Serviço
• Não somos responsáveis se os códigos ZIP sugeridos não funcionarem
• Não somos responsáveis por decisões tomadas por plataformas de terceiros (Instacart, DoorDash, etc.)
• Nossa responsabilidade total não excederá o valor que você pagou pelo Serviço ($20.00 USD)
• Não somos responsáveis por mudanças nas políticas de plataformas de terceiros`
        },
        {
          title: "8. Privacidade e Dados",
          content: `• Seu uso do Serviço também é regido por nossa Política de Privacidade
• NÃO armazenamos dados de pagamento ou cartões de crédito
• O processamento de pagamentos é tratado exclusivamente pelo Stripe
• Implementamos medidas de segurança, mas não podemos garantir segurança absoluta
• Não compartilhamos seus dados com plataformas gig de terceiros`
        },
        {
          title: "9. Modificações ao Serviço",
          content: "Reservamo-nos o direito de modificar ou descontinuar o Serviço a qualquer momento sem aviso prévio. Não somos responsáveis por qualquer modificação, suspensão ou descontinuação do Serviço."
        },
        {
          title: "10. Lei Aplicável",
          content: "Estes Termos serão regidos e interpretados de acordo com as leis dos Estados Unidos da América, sem considerar suas disposições sobre conflito de leis."
        },
        {
          title: "11. Alterações aos Termos",
          content: "Reservamo-nos o direito de atualizar estes Termos a qualquer momento. O uso continuado do Serviço após as alterações constitui aceitação dos novos Termos."
        },
        {
          title: "12. Informações de Contato",
          content: `Para perguntas sobre estes Termos, entre em contato conosco em:
Email: legal@gigzipfinder.com
Endereço: GIG ZipFinder, Estados Unidos`
        }
      ]
    }
  };

  const currentContent = content[lang] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#0f172a] py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-[#1e293b] rounded-3xl p-8 lg:p-12 border border-cyan-500/20">
          <h1 className="text-4xl font-bold text-white mb-4">{currentContent.title}</h1>
          <p className="text-gray-400 mb-8">{currentContent.lastUpdated}</p>
          
          <p className="text-gray-300 mb-8 leading-relaxed">{currentContent.intro}</p>

          <div className="space-y-8">
            {currentContent.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">{section.title}</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-cyan-500/20">
            <p className="text-gray-400 text-sm">
              These terms are governed by the laws of the United States of America.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
