package marketplace.sensis.app.trendingnft;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TrendingnftService {

	@Autowired
	private TrendingnftRepository trendingnftRepository;
	
	public Trendingnft addTrendingnft(Trendingnft trendingnft) {
		return trendingnftRepository.save(trendingnft);
	}
	
	public List<Trendingnft> addTrendingnfts(List<Trendingnft> trendingnfts) {
		return (List<Trendingnft>) trendingnftRepository.saveAll(trendingnfts);
	}
	
	public List<Trendingnft> getTrendingnfts() {
		return (List<Trendingnft>) trendingnftRepository.findAll();
	}
	
	public void deleteTrendingnftByAddress(String address) {
		trendingnftRepository.deleteByAddress(address);
	}
}
