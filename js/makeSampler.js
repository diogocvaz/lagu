//clear pads
import alienpad from "../samples/_clear_pads/alienpad/*.wav"
import bond from "../samples/_clear_pads/bond/*.wav"
import citylight from "../samples/_clear_pads/citylight/*.wav"
import emotpad from "../samples/_clear_pads/emotpad/*.wav"
import mysticrift from "../samples/_clear_pads/mysticrift/*.wav"
import philia from "../samples/_clear_pads/philia/*.wav"
import gloria from "../samples/_clear_pads/gloria/*.wav"
import puro from "../samples/_clear_pads/puro/*.wav"
import resonator from "../samples/_clear_pads/resonator/*.wav"
import discovery from "../samples/_clear_pads/discovery/*.wav"

//cloudy pads
import bloom from "../samples/_cloudy_pads/bloom/*.wav"
import compass from "../samples/_cloudy_pads/compass/*.wav"
import pingwoopad from "../samples/_cloudy_pads/pingwoopad/*.wav"
import snakeflute from "../samples/_cloudy_pads/snakeflute/*.wav"
import indianow from "../samples/_cloudy_pads/indianow/*.wav"
import bubkes from "../samples/_cloudy_pads/bubkes/*.wav"
import embrace from "../samples/_cloudy_pads/embrace/*.wav"
import tubechoir from "../samples/_cloudy_pads/tubechoir/*.wav"
import coastline from "../samples/_cloudy_pads/coastline/*.wav"
import elfpresence from "../samples/_cloudy_pads/elfpresence/*.wav"

//heavy pads
import held from "../samples/_heavy_pads/held/*.wav"
import lightfog from "../samples/_heavy_pads/lightfog/*.wav"
import darkwarmth from "../samples/_heavy_pads/darkwarmth/*.wav"
import cryptolush from "../samples/_heavy_pads/cryptolush/*.wav"
import endeavour from "../samples/_heavy_pads/endeavour/*.wav"
import rustybells from "../samples/_heavy_pads/rustybells/*.wav"
import synthetichell from "../samples/_heavy_pads/synthetichell/*.wav"
import junerush from "../samples/_heavy_pads/junerush/*.wav"
import descend from "../samples/_heavy_pads/descend/*.wav"
import hollowed from "../samples/_heavy_pads/hollowed/*.wav"


//neutral pads
import brokenstring from "../samples/_neutral_pads/brokenstring/*.wav"
import violin from "../samples/_neutral_pads/violin/*.wav"
import spiritwash from "../samples/_neutral_pads/spiritwash/*.wav"
import clarinet from "../samples/_neutral_pads/clarinet/*.wav"
import densemarimba from "../samples/_neutral_pads/densemarimba/*.wav"
import flutesolo from "../samples/_neutral_pads/flutesolo/*.wav"
import harp from "../samples/_neutral_pads/harp/*.wav"
import grandpiano from "../samples/_neutral_pads/grandpiano/*.wav"
import analomagous from "../samples/_neutral_pads/analomagous/*.wav"
import earth from "../samples/_neutral_pads/earth/*.wav"
import pyk from "../samples/_neutral_pads/pyk/*.wav"
import wiccle from "../samples/_neutral_pads/wiccle/*.wav"

//bass
import deepbass from "../samples/_deepbass/*.wav"

export var makeSampler = (instrument) => {
    if (instrument == 'grandpiano') {
        return new Tone.Sampler({
            "C3": grandpiano.c3,
            "C4": grandpiano.c4,
            "C5": grandpiano.c5,
        });
    } else if (instrument == 'violin') {
        return new Tone.Sampler({
            "B4": violin.b4,
            "G4": violin.g4,
            "E5": violin.e5,
            "G5": violin.g5
        });
    } else if (instrument == 'analomagous') {
        return new Tone.Sampler({
            "C3": analomagous.c3,
            "C4": analomagous.c4,
            "E4": analomagous.e4
        });
    }  else if (instrument == 'pyk') {
        return new Tone.Sampler({
            "C2": pyk.c2,
            "C3": pyk.c3,
            "F3": pyk.f3
        });
    } else if (instrument == 'wiccle') {
        return new Tone.Sampler({
            "C3": wiccle.c3,
            "C4": wiccle.c4,
            "F4": wiccle.f4
        });
    } else if (instrument == 'deepbass') {
        return new Tone.Sampler({
            "C2": deepbass.c3,
            "G2": deepbass.e3,
            "C3": deepbass.c4
        });
    } else if (instrument == 'earth') {
        return new Tone.Sampler({
            "C2": earth.c2,
            "C3": earth.c3,
            "F3": earth.f3
        });
    } else if (instrument == 'alienpad') {
        return new Tone.Sampler({
            "C3": alienpad.c3,
            "C4": alienpad.c4,
            "F4": alienpad.f4
        });
    } else if (instrument == 'lightfog') {
        return new Tone.Sampler({
            "C1": lightfog.c1,
            "C2": lightfog.c2,
            "C3": lightfog.c3
        });
    } else if (instrument == 'emotpad') {
        return new Tone.Sampler({
            "C2": emotpad.c2,
            "C3": emotpad.c3,
            "F3": emotpad.f3
        });
    } else if (instrument == 'pingwoopad') {
        return new Tone.Sampler({
            "C2": pingwoopad.c2,
            "C3": pingwoopad.c3,
            "F3": pingwoopad.f3
        });
    } else if (instrument == 'bloom') {
        return new Tone.Sampler({
            "C2": bloom.c2,
            "C3": bloom.c3,
            "C4": bloom.c4
        });
    } else if (instrument == 'citylight') {
        return new Tone.Sampler({
            "E2": citylight.e2,
            "E3": citylight.e3,
            "E4": citylight.e4
        });
    } else if (instrument == 'brokenstring') {
        return new Tone.Sampler({
            "C2": brokenstring.c2,
            "C3": brokenstring.c3,
            "C4": brokenstring.c4
        });
    } else if (instrument == 'bond') {
        return new Tone.Sampler({
            "C2": bond.c2,
            "C3": bond.c3,
            "C4": bond.c4
        });
    } else if (instrument == 'compass') {
        return new Tone.Sampler({
            "C1": compass.c1,
            "C2": compass.c2,
            "C3": compass.c3
        });
    } else if (instrument == 'held') {
        return new Tone.Sampler({
            "C2": held.c2,
            "C3": held.c3,
            "C4": held.c4
        });
    } else if (instrument == 'mysticrift') {
        return new Tone.Sampler({
            "C1": mysticrift.c1,
            "C2": mysticrift.c2,
            "C3": mysticrift.c3
        });
    } else if (instrument == 'philia') {
        return new Tone.Sampler({
            "C2": philia.c2,
            "C3": philia.c3,
            "C4": philia.c4
        });
    } else if (instrument == 'snakeflute') {
        return new Tone.Sampler({
            "C2": snakeflute.c2,
            "C3": snakeflute.c3,
            "C4": snakeflute.c4
        });
    } else if (instrument == 'darkwarmth') {
        return new Tone.Sampler({
            "C2": darkwarmth.c2,
            "C3": darkwarmth.c3,
            "C4": darkwarmth.c4
        });
    } else if (instrument == 'spiritwash') {
        return new Tone.Sampler({
            "C2": spiritwash.c2,
            "C3": spiritwash.c3,
            "C4": spiritwash.c4
        });
    } else if (instrument == 'gloria') {
        return new Tone.Sampler({
            "C2": gloria.c2,
            "C3": gloria.c3,
            "C4": gloria.c4
        });
    } else if (instrument == 'indianow') {
        return new Tone.Sampler({
            "C2": indianow.c2,
            "C3": indianow.c3,
            "C4": indianow.c4
        });
    } else if (instrument == 'cryptolush') {
        return new Tone.Sampler({
            "C2": cryptolush.c2,
            "C3": cryptolush.c3,
            "C4": cryptolush.c4
        });
    } else if (instrument == 'endeavour') {
        return new Tone.Sampler({
            "C2": endeavour.c2,
            "C3": endeavour.c3,
            "C4": endeavour.c4
        });
    } else if (instrument == 'rustybells') {
        return new Tone.Sampler({
            "C2": rustybells.c2,
            "C3": rustybells.c3,
            "C4": rustybells.c4
        });
    } else if (instrument == 'synthetichell') {
        return new Tone.Sampler({
            "C3": synthetichell.c3,
            "C4": synthetichell.c4,
            "C5": synthetichell.c5
        });
    } else if (instrument == 'clarinet') {
        return new Tone.Sampler({
            "C2": clarinet.c2,
            "C3": clarinet.c3,
            "C4": clarinet.c4
        });
    } else if (instrument == 'densemarimba') {
        return new Tone.Sampler({
            "C2": densemarimba.c2,
            "C3": densemarimba.c3,
            "C4": densemarimba.c4
        });
    } else if (instrument == 'flutesolo') {
        return new Tone.Sampler({
            "C3": flutesolo.c3,
            "C4": flutesolo.c4,
            "C5": flutesolo.c5
        });
    } else if (instrument == 'harp') {
        return new Tone.Sampler({
            "C3": harp.c3,
            "C4": harp.c4,
            "C5": harp.c5
        });
    } else if (instrument == 'junerush') {
        return new Tone.Sampler({
            "C1": junerush.c1,
            "C2": junerush.c2,
            "C3": junerush.c3
        });
    } else if (instrument == 'descend') {
        return new Tone.Sampler({
            "C2": descend.c2,
            "C3": descend.c3,
            "C4": descend.c4
        });
    } else if (instrument == 'hollowed') {
        return new Tone.Sampler({
            "C1": hollowed.c1,
            "C2": hollowed.c2,
            "C3": hollowed.c3
        });
    } else if (instrument == 'bubkes') {
        return new Tone.Sampler({
            "C1": bubkes.c1,
            "C2": bubkes.c2,
            "C3": bubkes.c3
        });
    } else if (instrument == 'embrace') {
        return new Tone.Sampler({
            "C2": embrace.c2,
            "C3": embrace.c3,
            "C4": embrace.c4
        });
    } else if (instrument == 'tubechoir') {
        return new Tone.Sampler({
            "C2": tubechoir.c2,
            "C3": tubechoir.c3,
            "C4": tubechoir.c4,
            "C5": tubechoir.c5
        });
    } else if (instrument == 'coastline') {
        return new Tone.Sampler({
            "C1": coastline.c1,
            "C2": coastline.c2,
            "C3": coastline.c3
        });
    } else if (instrument == 'elfpresence') {
        return new Tone.Sampler({
            "C2": elfpresence.c2,
            "C3": elfpresence.c3,
            "C4": elfpresence.c4
        });
    } else if (instrument == 'puro') {
        return new Tone.Sampler({
            "C4": puro.c4,
            "C5": puro.c5,
            "C6": puro.c6
        });
    } else if (instrument == 'canny') {
        return new Tone.Sampler({
            "C1": canny.c1,
            "C2": canny.c2,
            "C3": canny.c3
        });
    } else if (instrument == 'discovery') {
        return new Tone.Sampler({
            "C2": discovery.c2,
            "C3": discovery.c3,
            "C4": discovery.c4
        });
    }
}