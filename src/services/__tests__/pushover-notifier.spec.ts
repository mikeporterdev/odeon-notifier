import { PushoverNotifier } from '../notifiers/pushover-notifier';
import { PushoverClient } from '../clients/pushover-client';
import { capture, instance, mock } from 'ts-mockito';

describe('Pushover Notifier', () => {

  let pushoverNotifier: PushoverNotifier;
  const mockedPushoverClient = mock(PushoverClient);

  beforeEach(() => {
    pushoverNotifier = new PushoverNotifier(instance(mockedPushoverClient));
  });

  it('should trigger pushover when given movies', async () => {
    await pushoverNotifier.notify([{ title: 'Test Movie', dates: [new Date(2020, 0, 4)] }]);

    const [arg] = capture(mockedPushoverClient.push).last();
    expect(arg.title).toBe('New movies uploaded to Odeon Glasgow Quay!');
    expect(arg.message).toBe('Test Movie - Showing on Sat Jan 04 2020!');
  });

  it('should trigger pushover with linebreaks when given more than one movies', async () => {
    await pushoverNotifier.notify([
      { title: 'Test Movie', dates: [new Date(2020, 0, 4)] },
      { title: 'Test Movie 2', dates: [new Date(2020, 0, 4)] },
    ]);

    const [arg] = capture(mockedPushoverClient.push).last();
    expect(arg.title).toBe('New movies uploaded to Odeon Glasgow Quay!');
    expect(arg.message).toBe('Test Movie - Showing on Sat Jan 04 2020!\nTest Movie 2 - Showing on Sat Jan 04 2020!');
  });

  it('should give date range when multiple dates available', async () => {
    await pushoverNotifier.notify([
      {
        title: 'Test Movie',
        dates: [
          new Date(2020, 0, 4),
          new Date(2020, 0, 5),
          new Date(2020, 0, 6),
        ],
      },
    ]);

    const [arg] = capture(mockedPushoverClient.push).last();
    expect(arg.title).toBe('New movies uploaded to Odeon Glasgow Quay!');
    expect(arg.message).toBe('Test Movie - Showing between Sat Jan 04 2020 and Mon Jan 06 2020!');
  });
});
