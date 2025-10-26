import Icon from '@/components/ui/icon';

const features = [
  {
    icon: 'Swords',
    title: 'PvP без ограничений',
    description: 'Сражайся где угодно и с кем угодно. Никаких защищённых зон и правил'
  },
  {
    icon: 'Pickaxe',
    title: 'Гриферство разрешено',
    description: 'Разрушай, строй, захватывай территории. Полная свобода действий'
  },
  {
    icon: 'Flame',
    title: 'Кастомные механики',
    description: 'Уникальные крафты, оружие и механики для более интересного геймплея'
  },
  {
    icon: 'Gem',
    title: 'Экономика',
    description: 'Развитая экономическая система с аукционом и торговлей между игроками'
  },
  {
    icon: 'Zap',
    title: 'Мощное железо',
    description: 'Высокопроизводительные сервера без лагов и задержек'
  },
  {
    icon: 'Trophy',
    title: 'Система кланов',
    description: 'Создавай свою империю, объединяйся с друзьями или сражайся в одиночку'
  }
];

const Features = () => {
  return (
    <section className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold text-primary uppercase tracking-wider">
            Преимущества сервера
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Всё, что нужно для настоящей анархии в Minecraft
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card/50 backdrop-blur-sm border border-primary/30 rounded-lg p-6 hover:border-accent hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 animate-fade-in hover-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mb-4 group-hover:bg-accent/20 transition-colors">
                <Icon name={feature.icon} className="text-primary group-hover:text-accent transition-colors" size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/30 rounded-lg p-8">
          <div className="text-center space-y-4">
            <Icon name="Sparkles" className="text-accent mx-auto" size={48} />
            <h3 className="text-2xl md:text-3xl font-bold text-primary">
              И это только начало!
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Мы постоянно развиваем сервер, добавляем новые механики и прислушиваемся к сообществу
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
