package marketplace.sensis.app.spotlight;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SpotlightService {

	@Autowired
	private SpotlightRepository spotlightRepository;
	
	public Spotlight addSpotlight(Spotlight spotlight) {
		return spotlightRepository.save(spotlight);
	}
	
	public List<Spotlight> addSpotlights(List<Spotlight> spotlights) {
		return (List<Spotlight>) spotlightRepository.saveAll(spotlights);
	}
	
	public List<Spotlight> getSpotlights() {
		return (List<Spotlight>) spotlightRepository.findAll();
	}
	
	public void deleteSpotlightByAddress(String address) {
		spotlightRepository.deleteByAddress(address);
	}
}
