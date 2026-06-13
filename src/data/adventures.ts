import type { Adventure } from '@/types';

export const adventures: Adventure[] = [
  {
    id: 'adventure-hongmen',
    title: '鸿门宴：生死一线',
    dynastyId: 'han',
    description: '公元前206年，你穿越到楚汉争霸的关键时刻。作为刘邦的随从，你将亲历那场惊心动魄的鸿门宴，用诗词知识做出正确的选择。',
    historicalEventId: 'event-han-1',
    year: -206,
    difficulty: 'easy',
    requiredPoemIds: ['poem-han-1'],
    startSceneId: 'scene-1',
    scenes: {
      'scene-1': {
        id: 'scene-1',
        title: '鸿门惊梦',
        description: '你睁开眼，发现自己身处一个古代军营中。远处传来号角声，营帐上写着一个大大的"项"字。',
        narrative: '你穿越了！现在是公元前206年，你是刘邦的随从，跟随主公来到项羽的军营——鸿门。\n\n项羽的谋士范增早已定下计策，要在宴会上刺杀刘邦。气氛紧张得让人窒息。\n\n张良拉着你说："此次赴宴，凶险万分。我们必须小心行事！"',
        imagePrompt: 'ancient Chinese military camp at dusk, Hongmen banquet scene, ancient Chinese soldiers with spears, traditional tents with flags, dramatic lighting',
        choices: [
          {
            id: 'choice-1a',
            text: '建议刘邦不去赴宴，直接返回灞上',
            consequence: {
              type: 'failure',
              nextSceneId: 'scene-bad-1',
              message: '刘邦说："我若不去，项羽必疑我有反心，反而会引兵来攻。这是下策！"',
              poemReveal: {
                poemId: 'poem-han-1',
                famousLine: '大风起兮云飞扬，',
                explanation: '刘邦深知，要成就大事，必须有"大风起兮云飞扬"的气魄，岂能临阵退缩？'
              }
            }
          },
          {
            id: 'choice-1b',
            text: '建议带樊哙等猛将一同赴宴，以防不测',
            requiredPoemKnowledge: {
              poemId: 'poem-han-1',
              famousLine: '安得猛士兮守四方！',
              hint: '刘邦的诗中表达了对勇士的渴望...'
            },
            consequence: {
              type: 'success',
              nextSceneId: 'scene-2',
              message: '刘邦点头称赞："说得好！樊哙勇猛，有他在，我无忧矣！"',
              poemReveal: {
                poemId: 'poem-han-1',
                famousLine: '安得猛士兮守四方！',
                explanation: '刘邦曾写下"安得猛士兮守四方"，他深知猛将的重要性。樊哙正是他最信任的勇士之一。'
              }
            }
          },
          {
            id: 'choice-1c',
            text: '建议刘邦带厚礼向项羽示好',
            consequence: {
              type: 'neutral',
              nextSceneId: 'scene-2',
              message: '刘邦说："礼物可以带，但更重要的是态度要谦恭。"',
              poemReveal: {
                poemId: 'poem-han-1',
                famousLine: '威加海内兮归故乡，',
                explanation: '刘邦此时虽然实力不如项羽，但他心中怀有"威加海内兮归故乡"的大志，懂得韬光养晦。'
              }
            }
          }
        ]
      },
      'scene-2': {
        id: 'scene-2',
        title: '宴会惊魂',
        description: '你来到项羽的大帐，宴会开始了。范增频频示意项羽动手，但项羽默然不应。',
        narrative: '宴会之上，项羽坐在主位，刘邦坐在客位。范增多次举起身上的玉玦，示意项羽下决心杀刘邦，但项羽都装作没看见。\n\n范增无奈，起身出帐，找来项庄，对他说："君王为人不忍。你进去敬酒，然后舞剑，趁机杀了刘邦！"',
        imagePrompt: 'ancient Chinese imperial banquet, Hongmen feast, warriors with swords, tense atmosphere, traditional Chinese interior with silk curtains',
        choices: [
          {
            id: 'choice-2a',
            text: '大声喊出"项庄舞剑，意在沛公！"提醒刘邦',
            requiredPoemKnowledge: {
              poemId: 'poem-tang-sheng-2',
              famousLine: '感时花溅泪，恨别鸟惊心。',
              hint: '杜甫在战乱中表达了对国家命运的担忧...'
            },
            consequence: {
              type: 'success',
              nextSceneId: 'scene-3',
              message: '你大喊一声，满座皆惊！张良趁机说："项将军舞剑甚佳，但一人独舞，不如双人对舞！"',
              poemReveal: {
                poemId: 'poem-tang-sheng-2',
                famousLine: '感时花溅泪，恨别鸟惊心。',
                explanation: '在这危急时刻，你"感时花溅泪，恨别鸟惊心"，勇敢地站出来，拯救了刘邦的性命。'
              }
            }
          },
          {
            id: 'choice-2b',
            text: '悄悄去找樊哙进来解围',
            consequence: {
              type: 'success',
              nextSceneId: 'scene-3',
              message: '你悄悄溜出大帐，找到樊哙。樊哙听说情况危急，持剑拥盾闯入帐中！',
              poemReveal: {
                poemId: 'poem-han-1',
                famousLine: '安得猛士兮守四方！',
                explanation: '樊哙就是刘邦的"猛士"！他怒发冲冠，项羽都为之动容，问："壮士！能复饮乎？"'
              }
            }
          },
          {
            id: 'choice-2c',
            text: '装作没看见，继续喝酒',
            consequence: {
              type: 'failure',
              nextSceneId: 'scene-bad-2',
              message: '项庄舞剑，剑剑指向刘邦。就在千钧一发之际，项伯起身挡在刘邦面前...但你错失了立功的机会。',
              poemReveal: {
                poemId: 'poem-tang-sheng-2',
                famousLine: '烽火连三月，家书抵万金。',
                explanation: '在战乱年代，保护好主公，才能让更多的人免受"烽火连三月"之苦，让更多家庭免于"家书抵万金"的思念。'
              }
            }
          }
        ]
      },
      'scene-3': {
        id: 'scene-3',
        title: '金蝉脱壳',
        description: '樊哙闯入帐中，项羽赐酒赐肉。刘邦借口如厕，准备逃离。',
        narrative: '樊哙闯入帐中，怒视项羽。项羽问："壮士！能复饮乎？"赐酒赐肉。樊哙一饮而尽，拔剑切肉而食。\n\n刘邦见气氛缓和，借口如厕，招樊哙一同出帐。\n\n张良让你也一同出来，说："我们快走！抄小路回灞上！"',
        imagePrompt: 'ancient Chinese warrior with shield and sword, dramatic pose, night escape scene with moon and shadows, traditional Chinese palace garden at night',
        choices: [
          {
            id: 'choice-3a',
            text: '劝刘邦带上礼物正式告辞再走',
            requiredPoemKnowledge: {
              poemId: 'poem-tang-chu-2',
              famousLine: '海内存知己，天涯若比邻。',
              hint: '王勃送别朋友时表达了真挚的友谊...'
            },
            consequence: {
              type: 'failure',
              nextSceneId: 'scene-bad-3',
              message: '樊哙怒道："大行不顾细谨，大礼不辞小让。如今人为刀俎，我为鱼肉，何辞为！"',
              poemReveal: {
                poemId: 'poem-tang-chu-2',
                famousLine: '海内存知己，天涯若比邻。',
                explanation: '虽然"海内存知己，天涯若比邻"，但此刻项羽并非知己，而是虎狼！保命要紧！'
              }
            }
          },
          {
            id: 'choice-3b',
            text: '建议刘邦立刻从小路逃走，你留下来善后',
            requiredPoemKnowledge: {
              poemId: 'poem-song-south-1',
              famousLine: '人生自古谁无死，留取丹心照汗青。',
              hint: '文天祥表达了视死如归的气节...'
            },
            consequence: {
              type: 'success',
              nextSceneId: 'scene-good',
              message: '刘邦感动地说："你真是忠臣！我记下了你的功劳！"',
              poemReveal: {
                poemId: 'poem-song-south-1',
                famousLine: '人生自古谁无死，留取丹心照汗青。',
                explanation: '你展现了"人生自古谁无死，留取丹心照汗青"的气节。你的名字，将被历史铭记！'
              }
            }
          },
          {
            id: 'choice-3c',
            text: '让张良留下善后，你保护刘邦从小路逃走',
            consequence: {
              type: 'success',
              nextSceneId: 'scene-good',
              message: '张良说："好！我留下。你们快走！"于是你保护着刘邦，从小路逃回了灞上。',
              poemReveal: {
                poemId: 'poem-han-1',
                famousLine: '大风起兮云飞扬，威加海内兮归故乡，安得猛士兮守四方！',
                explanation: '你保护了未来的汉高祖。多年后，刘邦平定天下，高唱《大风歌》，他不会忘记你的功劳！'
              }
            }
          }
        ]
      },
      'scene-good': {
        id: 'scene-good',
        title: '历史的转折',
        description: '你成功帮助刘邦逃脱了鸿门宴，历史将因你而改变！',
        narrative: '你成功保护刘邦逃回了灞上。\n\n张良估计你们已经走远，才进帐对项羽说："沛公不胜酒力，不能当面告辞。谨使臣良奉白璧一双，再拜献大王足下；玉斗一双，再拜奉大将军足下。"\n\n项羽问："沛公安在？"张良说："闻大王有意督过之，脱身独去，已至军矣。"\n\n项羽收下白璧，放在座位上。范增接过玉斗，放在地上，拔剑撞而破之，说："唉！竖子不足与谋！夺项王天下者，必沛公也！"\n\n四年后，刘邦击败项羽，建立汉朝，开启了大汉四百年的江山。\n\n你，作为亲历鸿门宴的英雄，将永远被历史铭记！',
        imagePrompt: 'triumphant ancient Chinese emperor Liu Bang with army, celebration scene, Chinese imperial palace, golden light, historical epic scene',
        choices: [
          {
            id: 'choice-good-1',
            text: '接受刘邦的封赏，成为汉朝的开国功臣',
            consequence: {
              type: 'success',
              nextSceneId: null,
              message: '恭喜你！你成为了大汉王朝的开国功臣，封万户侯，名垂青史！'
            }
          }
        ]
      },
      'scene-bad-1': {
        id: 'scene-bad-1',
        title: '错失良机',
        description: '你的错误建议让刘邦陷入了被动。',
        narrative: '虽然刘邦没有采纳你的建议，还是去赴宴了，但他对你的见识产生了怀疑。\n\n虽然鸿门宴上刘邦最终脱险，但你在他心中的地位一落千丈。\n\n历史没有记住你的名字...',
        imagePrompt: 'ancient Chinese warrior looking disappointed, sunset scene, lonely figure, dramatic lighting',
        choices: [
          {
            id: 'choice-bad-1',
            text: '重新开始',
            consequence: {
              type: 'neutral',
              nextSceneId: 'scene-1',
              message: '时光倒流，你获得了重新选择的机会。'
            }
          }
        ]
      },
      'scene-bad-2': {
        id: 'scene-bad-2',
        title: '险象环生',
        description: '你的怯懦让刘邦陷入了极大的危险。',
        narrative: '虽然项伯暂时挡住了项庄的剑，但范增已经注意到了你。\n\n宴会结束后，范增告诉项羽："此人看似普通，实则危险，必须除掉！"\n\n你被秘密处决，历史上没有留下你的名字...',
        imagePrompt: 'dark ancient Chinese palace interior, shadows, mysterious atmosphere, sense of danger',
        choices: [
          {
            id: 'choice-bad-2',
            text: '重新开始',
            consequence: {
              type: 'neutral',
              nextSceneId: 'scene-1',
              message: '时光倒流，你获得了重新选择的机会。'
            }
          }
        ]
      },
      'scene-bad-3': {
        id: 'scene-bad-3',
        title: '功亏一篑',
        description: '你的迂腐差点害了刘邦。',
        narrative: '樊哙骂醒了你们。你们从小路仓皇逃走，虽然保住了性命，但你在刘邦心中已经成了一个迂腐不堪的人。\n\n汉朝建立后，你没有得到任何封赏...',
        imagePrompt: 'ancient Chinese scholar looking dejected, walking alone on a long road, autumn scenery, melancholic atmosphere',
        choices: [
          {
            id: 'choice-bad-3',
            text: '重新开始',
            consequence: {
              type: 'neutral',
              nextSceneId: 'scene-1',
              message: '时光倒流，你获得了重新选择的机会。'
            }
          }
        ]
      }
    }
  },
  {
    id: 'adventure-anshi',
    title: '安史之乱：长安保卫战',
    dynastyId: 'tang',
    description: '公元755年，安史之乱爆发。你穿越到长安城，成为一名守城士兵。用你的诗词知识，在战乱中做出正确的选择。',
    historicalEventId: 'event-tang-3',
    year: 755,
    difficulty: 'medium',
    requiredPoemIds: ['poem-tang-sheng-2', 'poem-tang-4'],
    startSceneId: 'scene-1',
    scenes: {
      'scene-1': {
        id: 'scene-1',
        title: '烽火长安',
        description: '公元756年的夏天，安禄山的叛军逼近长安，人心惶惶。',
        narrative: '你是长安城的一名守城士兵。站在城楼上，望着远方滚滚的烟尘，你知道，长安城的末日即将来临。\n\n街上，百姓们纷纷收拾行装，准备逃离。店铺都关了门，往日繁华的长安城，如今一片萧条。\n\n你看到一位老人站在街头，望着长安城的方向，泪流满面。那是——杜甫！',
        imagePrompt: 'ancient Chinese city wall of Chang\'an under siege, smoke rising in distance, worried citizens packing belongings, sunset sky, dramatic war scene',
        choices: [
          {
            id: 'choice-1a',
            text: '走过去安慰杜甫："老先生，快走吧，叛军就要来了！"',
            requiredPoemKnowledge: {
              poemId: 'poem-tang-sheng-2',
              famousLine: '国破山河在，城春草木深。',
              hint: '杜甫在春望中描写了国破家亡的景象...'
            },
            consequence: {
              type: 'success',
              nextSceneId: 'scene-2',
              message: '杜甫含泪说道："国破山河在，城春草木深。长安，终究是保不住了..."',
              poemReveal: {
                poemId: 'poem-tang-sheng-2',
                famousLine: '国破山河在，城春草木深。',
                explanation: '这首《春望》就是杜甫在此时所作。国都沦陷，城池残破，虽然山河依旧，可是乱草遍地，林木苍苍。'
              }
            }
          },
          {
            id: 'choice-1b',
            text: '加入士兵的行列，准备死守长安',
            requiredPoemKnowledge: {
              poemId: 'poem-tang-sheng-3',
              famousLine: '但使龙城飞将在，不教胡马度阴山。',
              hint: '王昌龄表达了对良将的渴望...'
            },
            consequence: {
              type: 'success',
              nextSceneId: 'scene-2',
              message: '你的将军拍着你的肩膀说："好样的！如果人人都像你这样，何愁叛军不灭！"',
              poemReveal: {
                poemId: 'poem-tang-sheng-3',
                famousLine: '但使龙城飞将在，不教胡马度阴山。',
                explanation: '你想起了王昌龄的诗句："但使龙城飞将在，不教胡马度阴山。"你决心像"飞将军"李广那样，保卫家国！'
              }
            }
          },
          {
            id: 'choice-1c',
            text: '偷偷收拾东西，准备趁乱逃走',
            consequence: {
              type: 'failure',
              nextSceneId: 'scene-bad-1',
              message: '你的同伴鄙夷地看着你："贪生怕死之徒！"',
              poemReveal: {
                poemId: 'poem-song-south-1',
                famousLine: '人生自古谁无死，留取丹心照汗青。',
                explanation: '文天祥说过"人生自古谁无死，留取丹心照汗青。"作为士兵，怎能临阵脱逃？'
              }
            }
          }
        ]
      },
      'scene-2': {
        id: 'scene-2',
        title: '马嵬坡之变',
        description: '唐玄宗带着杨贵妃逃出长安，行至马嵬坡，士兵哗变。',
        narrative: '长安城最终还是陷落了。你保护着唐玄宗和杨贵妃，一路向西逃去。\n\n行至马嵬坡，将士们又累又饿，怨气冲天。大将军陈玄礼认为，这场祸乱都是因为杨国忠造成的，必须杀了他！\n\n士兵们杀了杨国忠后，仍然不肯散去。他们包围了驿站，要求唐玄宗处死杨贵妃！',
        imagePrompt: 'ancient Chinese royal entourage at Maweipo, angry soldiers surrounding the imperial carriage, dramatic tension, sunset scene',
        choices: [
          {
            id: 'choice-2a',
            text: '站出来求情："杨贵妃无罪，请陛下饶她一命！"',
            requiredPoemKnowledge: {
              poemId: 'poem-tang-wan-1',
              famousLine: '春蚕到死丝方尽，蜡炬成灰泪始干。',
              hint: '李商隐的无题诗表达了刻骨铭心的爱情...'
            },
            consequence: {
              type: 'failure',
              nextSceneId: 'scene-bad-2',
              message: '士兵们怒喝道："妖女祸国，不杀不足以平民愤！"你差点被乱兵所杀。',
              poemReveal: {
                poemId: 'poem-tang-wan-1',
                famousLine: '春蚕到死丝方尽，蜡炬成灰泪始干。',
                explanation: '虽然"春蚕到死丝方尽，蜡炬成灰泪始干"诉说了爱情的坚贞，但此刻不是谈情说爱的时候。杨贵妃必须死，否则军心不稳。'
              }
            }
          },
          {
            id: 'choice-2b',
            text: '劝唐玄宗忍痛割爱，赐死杨贵妃以安军心',
            requiredPoemKnowledge: {
              poemId: 'poem-tang-sheng-2',
              famousLine: '烽火连三月，家书抵万金。',
              hint: '杜甫描写了战乱中人民的痛苦...'
            },
            consequence: {
              type: 'success',
              nextSceneId: 'scene-3',
              message: '唐玄宗老泪纵横："你说得对...传朕旨意，赐杨贵妃白绫..."',
              poemReveal: {
                poemId: 'poem-tang-sheng-2',
                famousLine: '烽火连三月，家书抵万金。',
                explanation: '"烽火连三月，家书抵万金。"多少家庭因为这场战乱而破碎？为了平定叛乱，为了天下百姓，唐玄宗必须做出牺牲。'
              }
            }
          },
          {
            id: 'choice-2c',
            text: '建议让杨贵妃化装逃走',
            consequence: {
              type: 'neutral',
              nextSceneId: 'scene-3',
              message: '高力士说："万万不可！将士们亲眼看到她死了，才会放心。"',
              poemReveal: {
                poemId: 'poem-tang-wan-2',
                famousLine: '东风不与周郎便，铜雀春深锁二乔。',
                explanation: '杜牧说过"东风不与周郎便，铜雀春深锁二乔。"如果杨贵妃不死，历史可能会改写，大唐可能会就此覆灭！'
              }
            }
          }
        ]
      },
      'scene-3': {
        id: 'scene-3',
        title: '卖炭翁的遭遇',
        description: '你来到长安附近的一个集市，看到一群宦官正在公开掠夺百姓。',
        narrative: '安史之乱后，你成为了一名巡查御史，负责体察民情。\n\n这一天，你来到长安附近的一个集市。只见一个卖炭的老人，赶着一头牛车，车上装着一千多斤炭。\n\n突然，两个骑马的宦官冲了过来，手里拿着文书，口称"宫市"，就要把炭抢走！\n\n只给了老人半匹红纱一丈绫，系在牛头上，就算是炭的价钱了！',
        imagePrompt: 'ancient Chinese market scene, poor old charcoal seller with ox cart, arrogant imperial eunuchs on horses, poor villagers watching helplessly, winter scene with snow',
        choices: [
          {
            id: 'choice-3a',
            text: '冲上去阻止宦官，为老人主持公道',
            requiredPoemKnowledge: {
              poemId: 'poem-tang-4',
              famousLine: '可怜身上衣正单，心忧炭贱愿天寒。',
              hint: '白居易的新乐府诗揭露了宫市的罪恶...'
            },
            consequence: {
              type: 'success',
              nextSceneId: 'scene-good',
              message: '你大喝一声："住手！宫市害民，本御史饶不了你们！"宦官们灰溜溜地逃走了。',
              poemReveal: {
                poemId: 'poem-tang-4',
                famousLine: '可怜身上衣正单，心忧炭贱愿天寒。',
                explanation: '这就是白居易《卖炭翁》中描写的"宫市"之弊。"可怜身上衣正单，心忧炭贱愿天寒。"你为民做主，真正理解了这首诗的深意。'
              }
            }
          },
          {
            id: 'choice-3b',
            text: '悄悄记下这件事，回去上奏皇上，请求废除宫市',
            requiredPoemKnowledge: {
              poemId: 'poem-tang-zhong-3',
              famousLine: '师者，所以传道受业解惑也。',
              hint: '韩愈提倡文以载道...'
            },
            consequence: {
              type: 'success',
              nextSceneId: 'scene-good',
              message: '你回去后，写了一道措辞激烈的奏章，痛陈宫市之弊。皇帝虽然没有完全废除宫市，但也做出了一些让步。',
              poemReveal: {
                poemId: 'poem-tang-zhong-3',
                famousLine: '师者，所以传道受业解惑也。',
                explanation: '韩愈说过"师者，所以传道受业解惑也。"作为御史，你同样要"传道"——传播正义之道，为百姓解惑。'
              }
            }
          },
          {
            id: 'choice-3c',
            text: '多一事不如少一事，假装没看见',
            consequence: {
              type: 'failure',
              nextSceneId: 'scene-bad-3',
              message: '你转过身去，身后传来老人绝望的哭声...',
              poemReveal: {
                poemId: 'poem-tang-4',
                famousLine: '卖炭得钱何所营？身上衣裳口中食。',
                explanation: '白居易写道："卖炭得钱何所营？身上衣裳口中食。"这一车炭，是老人全部的希望啊！你的冷漠，让人心寒。'
              }
            }
          }
        ]
      },
      'scene-good': {
        id: 'scene-good',
        title: '诗史之光',
        description: '你用你的行动，诠释了唐诗的精神。',
        narrative: '安史之乱终于平定了。\n\n你成为了一名为民请命的好官，所到之处，百姓安居乐业。\n\n多年后，你在长安街头再次遇到了杜甫。\n\n他握着你的手说："我见过很多官员，但像你这样真正理解诗歌精神的，不多。你让我知道，诗歌不仅仅是文字，更是一种精神，一种力量！"\n\n你笑着说："这都是从您的诗中学来的。"',
        imagePrompt: 'peaceful ancient Chinese city after war, people rebuilding, smiling children, blooming flowers, rainbow in sky, hopeful atmosphere',
        choices: [
          {
            id: 'choice-good-1',
            text: '与杜甫一起，继续为百姓发声',
            consequence: {
              type: 'success',
              nextSceneId: null,
              message: '恭喜你！你成为了唐诗精神的传承者，你的名字，将与那些伟大的诗篇一起，流传千古！'
            }
          }
        ]
      },
      'scene-bad-1': {
        id: 'scene-bad-1',
        title: '逃兵的下场',
        description: '你的怯懦让你付出了代价。',
        narrative: '你趁乱逃走了。\n\n但乱世之中，一个逃兵又能去哪里呢？\n\n你辗转于各个战场，几次险些丧命。最后，你在一个寒冷的冬天，冻死在了路边。\n\n没有人知道你的名字...',
        imagePrompt: 'lonely frozen soldier on snowy ancient Chinese road, bare trees, winter storm, tragic atmosphere',
        choices: [
          {
            id: 'choice-bad-1',
            text: '重新开始',
            consequence: {
              type: 'neutral',
              nextSceneId: 'scene-1',
              message: '时光倒流，你获得了重新选择的机会。'
            }
          }
        ]
      },
      'scene-bad-2': {
        id: 'scene-bad-2',
        title: '哗变的后果',
        description: '你的求情差点引发更大的哗变。',
        narrative: '士兵们差点连你一起杀了。幸好高力士及时出面，才保住了你的性命。\n\n但你被驱逐出了军营，永远失去了报效国家的机会。\n\n杨贵妃最终还是被赐死了，而你，成了一个笑柄...',
        imagePrompt: 'expelled soldier walking alone in desert, sunset, lonely figure, sense of shame and regret',
        choices: [
          {
            id: 'choice-bad-2',
            text: '重新开始',
            consequence: {
              type: 'neutral',
              nextSceneId: 'scene-1',
              message: '时光倒流，你获得了重新选择的机会。'
            }
          }
        ]
      },
      'scene-bad-3': {
        id: 'scene-bad-3',
        title: '冷漠的代价',
        description: '你的冷漠让老人失去了一切。',
        narrative: '那天晚上，你做了一个噩梦。梦里，卖炭老人流着泪对你说："那车炭，是我过冬的希望啊..."\n\n你从梦中惊醒，冷汗直流。\n\n第二天，你听说那个卖炭老人，在那天夜里，冻死在了破庙里。\n\n你一辈子都活在愧疚之中...',
        imagePrompt: "ancient Chinese temple ruins at night, old man's ghostly figure, moonlight, remorseful atmosphere",
        choices: [
          {
            id: 'choice-bad-3',
            text: '重新开始',
            consequence: {
              type: 'neutral',
              nextSceneId: 'scene-1',
              message: '时光倒流，你获得了重新选择的机会。'
            }
          }
        ]
      }
    }
  }
];

export const getAllAdventures = () => adventures;

export const getAdventureById = (id: string) => 
  adventures.find(a => a.id === id);

export const getAdventuresByDynastyId = (dynastyId: string) => 
  adventures.filter(a => a.dynastyId === dynastyId);

export default adventures;
