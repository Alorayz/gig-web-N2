import React from 'react';
import { useTranslation } from 'react-i18next';

export const PrivacyPolicy = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const content = {
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: December 20, 2025",
      intro: "GIG ZipFinder ('we', 'our', or 'us') is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website.",
      sections: [
        {
          title: "1. Information We Collect",
          content: `We collect information that you provide directly to us when using our services:
• Account information (name, email address)
• Phone numbers provided through our service
• Payment information (processed securely through Stripe - we do NOT store or save any credit card or payment data)
• Usage data and analytics
• Device information and IP address`
        },
        {
          title: "2. How We Use Your Information",
          content: `We use the information we collect to:
• Provide and maintain our services
• Process payments through Stripe (we do not store payment data)
• Send you service-related communications
• Improve and optimize our AI algorithms
• Comply with legal obligations
• Prevent fraud and enhance security`
        },
        {
          title: "3. Payment Processing",
          content: `All payment transactions are processed by Stripe, Inc. We do NOT store, save, or have access to your credit card information or payment details. Stripe maintains PCI-DSS compliance and uses industry-standard encryption. For more information about how Stripe handles your payment data, please visit Stripe's Privacy Policy.`
        },
        {
          title: "4. Data Sharing and Disclosure",
          content: `We do not sell, trade, or rent your personal information to third parties. We may share information with:
• Service providers (like Stripe for payment processing)
• Legal authorities when required by law
• In connection with business transfers or mergers

IMPORTANT: We are NOT affiliated with, partners of, or endorsed by Instacart, DoorDash, Spark Driver, or any other gig economy platforms. We do not share your data with these companies.`
        },
        {
          title: "5. Data Security",
          content: `We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure. We do not store sensitive payment information on our servers.`
        },
        {
          title: "6. Your Rights",
          content: `Depending on your location, you may have rights including:
• Access to your personal data
• Correction of inaccurate data
• Deletion of your data
• Objection to data processing
• Data portability

To exercise these rights, contact us at privacy@gigzipfinder.com`
        },
        {
          title: "7. Children's Privacy",
          content: `Our services are not intended for users under 18 years of age. We do not knowingly collect information from children under 18.`
        },
        {
          title: "8. Changes to This Policy",
          content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.`
        },
        {
          title: "9. Contact Us",
          content: `If you have questions about this Privacy Policy, contact us at:
Email: privacy@gigzipfinder.com
Address: GIG ZipFinder, United States`
        }
      ]
    },
    es: {
      title: "Política de Privacidad",
      lastUpdated: "Última Actualización: 20 de Diciembre, 2025",
      intro: "GIG ZipFinder ('nosotros', 'nuestro' o 'nos') está comprometido a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos tu información cuando usas nuestra aplicación móvil y sitio web.",
      sections: [
        {
          title: "1. Información que Recopilamos",
          content: `Recopilamos información que nos proporcionas directamente al usar nuestros servicios:
• Información de cuenta (nombre, dirección de correo electrónico)
• Números de teléfono proporcionados a través de nuestro servicio
• Información de pago (procesada de forma segura a través de Stripe - NO almacenamos ni guardamos ningún dato de tarjeta de crédito o pago)
• Datos de uso y análisis
• Información del dispositivo y dirección IP`
        },
        {
          title: "2. Cómo Usamos tu Información",
          content: `Usamos la información que recopilamos para:
• Proporcionar y mantener nuestros servicios
• Procesar pagos a través de Stripe (no almacenamos datos de pago)
• Enviarte comunicaciones relacionadas con el servicio
• Mejorar y optimizar nuestros algoritmos de IA
• Cumplir con obligaciones legales
• Prevenir fraudes y mejorar la seguridad`
        },
        {
          title: "3. Procesamiento de Pagos",
          content: `Todas las transacciones de pago son procesadas por Stripe, Inc. NO almacenamos, guardamos ni tenemos acceso a tu información de tarjeta de crédito o detalles de pago. Stripe mantiene el cumplimiento de PCI-DSS y utiliza encriptación estándar de la industria. Para más información sobre cómo Stripe maneja tus datos de pago, visita la Política de Privacidad de Stripe.`
        },
        {
          title: "4. Compartición y Divulgación de Datos",
          content: `No vendemos, comerciamos ni alquilamos tu información personal a terceros. Podemos compartir información con:
• Proveedores de servicios (como Stripe para procesamiento de pagos)
• Autoridades legales cuando lo requiera la ley
• En conexión con transferencias o fusiones comerciales

IMPORTANTE: NO estamos afiliados, somos socios ni estamos respaldados por Instacart, DoorDash, Spark Driver o cualquier otra plataforma de gig economy. No compartimos tus datos con estas compañías.`
        },
        {
          title: "5. Seguridad de Datos",
          content: `Implementamos medidas técnicas y organizativas apropiadas para proteger tu información personal. Sin embargo, ningún método de transmisión por internet es 100% seguro. No almacenamos información sensible de pago en nuestros servidores.`
        },
        {
          title: "6. Tus Derechos",
          content: `Dependiendo de tu ubicación, puedes tener derechos incluyendo:
• Acceso a tus datos personales
• Corrección de datos inexactos
• Eliminación de tus datos
• Objeción al procesamiento de datos
• Portabilidad de datos

Para ejercer estos derechos, contáctanos en privacy@gigzipfinder.com`
        },
        {
          title: "7. Privacidad de Menores",
          content: `Nuestros servicios no están destinados a usuarios menores de 18 años. No recopilamos información de menores de 18 años a sabiendas.`
        },
        {
          title: "8. Cambios a Esta Política",
          content: `Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos de cualquier cambio publicando la nueva Política de Privacidad en esta página y actualizando la fecha de "Última Actualización".`
        },
        {
          title: "9. Contáctanos",
          content: `Si tienes preguntas sobre esta Política de Privacidad, contáctanos en:
Email: privacy@gigzipfinder.com
Dirección: GIG ZipFinder, Estados Unidos`
        }
      ]
    },
    pt: {
      title: "Política de Privacidade",
      lastUpdated: "Última Atualização: 20 de Dezembro, 2025",
      intro: "GIG ZipFinder ('nós', 'nosso' ou 'nos') está comprometido em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você usa nosso aplicativo móvel e site.",
      sections: [
        {
          title: "1. Informações que Coletamos",
          content: `Coletamos informações que você nos fornece diretamente ao usar nossos serviços:
• Informações da conta (nome, endereço de e-mail)
• Números de telefone fornecidos através do nosso serviço
• Informações de pagamento (processadas com segurança através do Stripe - NÃO armazenamos nem guardamos nenhum dado de cartão de crédito ou pagamento)
• Dados de uso e análise
• Informações do dispositivo e endereço IP`
        },
        {
          title: "2. Como Usamos suas Informações",
          content: `Usamos as informações que coletamos para:
• Fornecer e manter nossos serviços
• Processar pagamentos através do Stripe (não armazenamos dados de pagamento)
• Enviar comunicações relacionadas ao serviço
• Melhorar e otimizar nossos algoritmos de IA
• Cumprir obrigações legais
• Prevenir fraudes e melhorar a segurança`
        },
        {
          title: "3. Processamento de Pagamentos",
          content: `Todas as transações de pagamento são processadas pela Stripe, Inc. NÃO armazenamos, guardamos nem temos acesso às suas informações de cartão de crédito ou detalhes de pagamento. A Stripe mantém a conformidade com PCI-DSS e usa criptografia padrão da indústria. Para mais informações sobre como a Stripe lida com seus dados de pagamento, visite a Política de Privacidade da Stripe.`
        },
        {
          title: "4. Compartilhamento e Divulgação de Dados",
          content: `Não vendemos, negociamos ou alugamos suas informações pessoais a terceiros. Podemos compartilhar informações com:
• Provedores de serviços (como Stripe para processamento de pagamentos)
• Autoridades legais quando exigido por lei
• Em conexão com transferências ou fusões comerciais

IMPORTANTE: NÃO somos afiliados, parceiros ou endossados pelo Instacart, DoorDash, Spark Driver ou qualquer outra plataforma de gig economy. Não compartilhamos seus dados com essas empresas.`
        },
        {
          title: "5. Segurança de Dados",
          content: `Implementamos medidas técnicas e organizacionais apropriadas para proteger suas informações pessoais. No entanto, nenhum método de transmissão pela internet é 100% seguro. Não armazenamos informações sensíveis de pagamento em nossos servidores.`
        },
        {
          title: "6. Seus Direitos",
          content: `Dependendo da sua localização, você pode ter direitos incluindo:
• Acesso aos seus dados pessoais
• Correção de dados imprecisos
• Exclusão dos seus dados
• Objeção ao processamento de dados
• Portabilidade de dados

Para exercer esses direitos, entre em contato conosco em privacy@gigzipfinder.com`
        },
        {
          title: "7. Privacidade de Menores",
          content: `Nossos serviços não são destinados a usuários menores de 18 anos. Não coletamos informações de menores de 18 anos conscientemente.`
        },
        {
          title: "8. Alterações a Esta Política",
          content: `Podemos atualizar esta Política de Privacidade ocasionalmente. Notificaremos você sobre quaisquer alterações publicando a nova Política de Privacidade nesta página e atualizando a data de "Última Atualização".`
        },
        {
          title: "9. Entre em Contato",
          content: `Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco em:
Email: privacy@gigzipfinder.com
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
              This policy is governed by the laws of the United States of America.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
